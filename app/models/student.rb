module Student
  extend ActiveSupport::Concern

  included do
    belongs_to :classroom, foreign_key: 'classcode', primary_key: 'code'
    has_one :teacher, through: :classroom

    has_many :assigned_activities, through: :classroom, source: :activities
    has_many :started_activities, through: :activity_sessions, source: :activity

    def unfinished_activities classroom
      classroom.activities - finished_activities(classroom)
    end

    def finished_activities classroom
      classroom_activity_score_join(classroom).where('activity_sessions.completed_at is not null')
    end

    def classroom_activity_score_join classroom
      started_activities.where(classroom_activities: { classroom_id: classroom.id })
    end
    protected :classroom_activity_score_join

    has_many :activity_sessions, dependent: :destroy do
      def rel_for_activity activity
        includes(:classroom_activity).where(classroom_activities: { activity_id: activity.id })
      end

      def for_activity activity
        rel_for_activity(activity).first
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
