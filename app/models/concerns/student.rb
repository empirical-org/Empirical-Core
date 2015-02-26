module Student
  extend ActiveSupport::Concern

  included do
    belongs_to :classroom, foreign_key: 'classcode', primary_key: 'code'
    has_one :teacher, through: :classroom

    has_many :assigned_activities, through: :classroom, source: :activities
    has_many :started_activities, through: :activity_sessions, source: :activity

    after_create :assign_classroom_activities
    after_update :assign_classroom_activities

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

    def percentages_by_classification(unit = nil)
      if unit.nil?
        # only occurs in scorebook; not necessary to cache this since well cache the parent method which this method is always called within when no unit is specified (complete_and_incomplete_activity_sessions_by_classification)
        units = self.classroom.classroom_activities.map(&:unit)
        arr = []
        units.each do |unit|
          sessions = helper1 unit, false
          arr.push sessions
        end
        sessions = arr.flatten
        sessions = filter_and_sort_completed_activity_sessions sessions

      else
        sessions = helper1 unit, true
      end
      sessions
    end

    def helper1 unit, should_filter
      key = 'student-completed-activity-sessions-' + self.id.to_s + unit.cache_key
      sessions = Rails.cache.fetch(key) do
        sessions = ActivitySession.joins(:classroom_activity)
                  .where("activity_sessions.user_id = ? AND classroom_activities.unit_id = ?", self.id, unit.id)
                  .select("activity_sessions.*").completed
        sessions
      end
      if should_filter then sessions = filter_and_sort_completed_activity_sessions(sessions) end
      sessions
    end


    def filter_and_sort_completed_activity_sessions sessions
      # we only want to show one session per classroom activity, not the retries, so filter them out thusly:
      arr = []
      x1 = sessions.to_a.group_by{|as| as.classroom_activity_id}
      x1.each do |key, ca_group|
        x2 = ca_group.max{|a, b| a.percentile <=> b.percentile}
        arr.push x2
      end
      sessions = arr

      sessions.sort do |a,b|
        if a.percentile == b.percentile
          b.activity.classification.key <=> a.activity.classification.key
        else
          b.percentile <=> a.percentile
        end
      end
      sessions
    end


    def incomplete_activity_sessions_by_classification(unit = nil)

      if unit.nil?
        # only occurs in scorebook; not necessary to cache this since well cache the parent method which this method is always called within when no unit is specified (complete_and_incomplete_activity_sessions_by_classification)
        units = self.classroom.classroom_activities.map(&:unit)
        arr = []
        units.each do |unit|
          sessions = helper2 unit, false
          arr.push sessions
        end
        sessions = arr.flatten
        sessions = sort_incomplete_activity_sessions sessions
      else
        sessions = helper2 unit, true
      end
      sessions

    end



    def helper2 unit, should_sort
      sessions = Rails.cache.fetch('student-incomplete_activity-sessions-' + self.id.to_s + unit.cache_key) do
        sessions = ActivitySession.joins(:classroom_activity)
                    .where("activity_sessions.user_id = ? AND classroom_activities.unit_id = ?", self.id, unit.id)
                    .where("activity_sessions.completed_at is null")
                    .where("activity_sessions.is_retry = false")
                    .select("activity_sessions.*")
        sessions
      end

      if should_sort then sessions = sort_incomplete_activity_sessions sessions end
      sessions
    end




    def sort_incomplete_activity_sessions sessions
      sessions.sort do |a,b|
        b.activity.classification.key <=> a.activity.classification.key
      end
      sessions
    end

    def complete_and_incomplete_activity_sessions_by_classification(unit = nil)
      arr1 = self.percentages_by_classification(unit)
      arr2 = self.incomplete_activity_sessions_by_classification(unit)
      arr3 = arr1.concat(arr2)
      arr3
    end



    def assign_classroom_activities
      if classroom.present?
        classroom.classroom_activities.each do |ca|
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
