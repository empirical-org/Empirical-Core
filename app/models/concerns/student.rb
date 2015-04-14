module Student
  extend ActiveSupport::Concern

  included do
    belongs_to :classroom, foreign_key: 'classcode', primary_key: 'code'
    has_one :teacher, through: :classroom

    has_many :assigned_activities, through: :classroom, source: :activities
    has_many :started_activities, through: :activity_sessions, source: :activity

    after_create :assign_classroom_activities

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

    def completed_activities
      activity_sessions.completed
                        .where(is_final_score: true)
    end

    def percentages_by_classification(unit = nil)

      if unit.nil?
        sessions = self.activity_sessions.where(is_final_score: true).completed
      else
        sessions = ActivitySession.joins(:classroom_activity)
                  .where(is_final_score: true)
                  .where("activity_sessions.user_id = ? AND classroom_activities.unit_id = ?", self.id, unit.id)
                  .select("activity_sessions.*").completed

      end

      # we only want to show one session per classroom activity (highest score), there may be multiple bc of retries :
      arr = []
      x1 = sessions.to_a.group_by{|as| as.classroom_activity_id}
      x1.each do |key, ca_group|
        x2 = ca_group.max{|a, b| a.percentile <=> b.percentile}
        arr.push x2
      end
      sessions = arr

      # sort by percentage
      sessions.sort do |a,b|
        if a.percentile == b.percentile
          b.activity.classification.key <=> a.activity.classification.key
        else
          b.percentile <=> a.percentile
        end
      end
    end


    def incomplete_activity_sessions_by_classification(unit = nil)

      if unit.nil?
        sessions = self.activity_sessions.incomplete
      else

        sessions = ActivitySession.joins(:classroom_activity)
                    .where("activity_sessions.user_id = ? AND classroom_activities.unit_id = ?", self.id, unit.id)
                    .where("activity_sessions.completed_at is null")
                    .where("activity_sessions.is_retry = false")
                    .select("activity_sessions.*")

      end

      sessions.sort do |a,b|
        b.activity.classification.key <=> a.activity.classification.key
      end


    end



    def complete_and_incomplete_activity_sessions_by_classification(unit = nil)
      arr1 = self.percentages_by_classification(unit)
      arr2 = self.incomplete_activity_sessions_by_classification(unit)
      arr3 = arr1.concat(arr2)
      arr3
    end

    def assign_classroom_activities
      return if classroom.nil?
      classroom.classroom_activities.each do |ca|
        if !ca.assigned_student_ids.try(:any?)
          assign = true
        elsif ca.assigned_student_ids.include?(self.id)
          assign = true
        else
          assign = false
        end
        if assign
          ca.session_for(self)
        end
      end
    end



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
