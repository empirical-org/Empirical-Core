module Student
  extend ActiveSupport::Concern

  included do
    #TODO: move these relationships into the users model

    has_many :students_classrooms, foreign_key: 'student_id', dependent: :destroy, class_name: "StudentsClassrooms"

    has_many :classrooms, through: :students_classrooms, source: :classroom, inverse_of: :students, class_name: "Classroom"
    has_many :activity_sessions, dependent: :destroy
    has_many :assigned_activities, through: :classrooms, source: :activities
    has_many :started_activities, through: :activity_sessions, source: :activity

    def finished_activities classroom
      classroom_activity_score_join(classroom).where('activity_sessions.completed_at is not null')
    end

    def classroom_activity_score_join classroom
      started_activities.joins('join classroom_activities ON classroom_activities.activity_id = activities.id').where(classroom_activities: { classroom_id: classroom.id })
    end
    protected :classroom_activity_score_join

    def get_student_average_score
      avg_str = ActiveRecord::Base.connection.execute(
       "select avg(percentage) from activity_sessions
        join users on activity_sessions.user_id = users.id
        join activities on activity_sessions.activity_id = activities.id
        where activities.activity_classification_id != 6
        and activities.activity_classification_id != 4
        and users.id = #{self.id}").to_a[0]['avg']
      (avg_str.to_f * 100).to_i
    end


  end
end
