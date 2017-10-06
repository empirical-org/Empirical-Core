module Student
  extend ActiveSupport::Concern

  included do
    #TODO: move these relationships into the users model

    has_many :students_classrooms, foreign_key: 'student_id', dependent: :destroy, class_name: "StudentsClassrooms"

    has_many :classrooms, through: :students_classrooms, source: :classroom, inverse_of: :students, class_name: "Classroom"
    # has_many :activities, through: :classrooms
    has_many :assigned_activities, through: :classrooms, source: :activities
    has_many :started_activities, through: :activity_sessions, source: :activity

    def unfinished_activities classroom
      classroom.activities - finished_activities(classroom)
    end

    def teachers
      classrooms.map(&:teacher)
    end

    def finished_activities classroom
      classroom_activity_score_join(classroom).where('activity_sessions.is_final_score is true')
    end

    def classroom_activity_score_join classroom
      started_activities.joins('join classroom_activities ON classroom_activities.activity_id = activities.id').where(classroom_activities: { classroom_id: classroom.id })
    end
    protected :classroom_activity_score_join

    def completed_activities
      activity_sessions.completed
                        .where(is_final_score: true)
    end

    def assign_classroom_activities(classroom_id=nil)
      classy = Classroom.find(classroom_id) unless classroom_id == nil
      @extant_act_sesh = self.activity_sessions
      # TODO: add includes here for the find
      students_classrooms = classy ? [classy] : self.classrooms
      assignable = students_classrooms.map do |classroom|
        get_assignable_classroom_activities_for_classroom(classroom)
      end
      if assignable.any?
        begin
          ActivitySession.bulk_insert values: assignable.flatten.compact
        rescue NoMethodError
        end
      end
    end


    def get_assignable_classroom_activities_for_classroom(classroom)
      classroom.classroom_activities.includes(:activity).map do |ca|
        @act_sesh_attributes =  {
                                activity_id: ca.activity_id,
                                classroom_activity_id: ca.id,
                                user_id: self.id
                               }
        does_not_have_activity = @extant_act_sesh.where(@act_sesh_attributes).none?
        student_should_be_assigned = ca.validate_assigned_student(self.id)
        if does_not_have_activity && student_should_be_assigned
            @act_sesh_attributes
        end
      end
    end

    has_many :activity_sessions, dependent: :destroy do
      def rel_for_activity activity
        includes(:classroom_activity).where(classroom_activities: { activity_id: activity.id })
      end

      # TODO: DELETE - ONLY USED IN TESTS?
      def for_activity activity
        sessions = rel_for_activity(activity)
        sessions ? sessions.firsts : nil 
      end

      def completed_for_activity activity
        rel_for_activity(activity).where('activity_sessions.completed_at is not null')
      end

      def for_classroom classroom
        includes(:classroom_activity).where(classroom_activities: { classroom_id: classroom.id })
      end
    end
  end
end
