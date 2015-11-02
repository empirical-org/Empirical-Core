class StudentProfileQuery

  def query(student)
    all = get_all(student)
    by_unit = group_by_unit(all)
    # by_unit_by_state = group_by_state(by_unit)
    # sorted = sort_sessions(by_unit_by_state)
  end

  private

  def get_all(student)
    sessions = student.activity_sessions
                      .preload(:activity, :classroom_activity, :concept_results)
  end

  def group_by_unit(all)
    all.group_by{|s| s.classroom_activity.unit_id}
  end

  def get_completed(all)
    all.completed.where(is_final_score: true)
  end

  def get_unstarted(all)
      all.where(completed_at: nil)
         .where(is_retry: false)
  end
end

=begin
what we need to do -
    order by percentage, classification_id
    group by unit_id

=end


=begin

    def percentages_by_classification(unit = nil)

      if unit.nil?
        sessions = self.activity_sessions.preload(:concept_results).where(is_final_score: true).completed
      else
        sessions = ActivitySession.joins(:classroom_activity)
                  .preload(:concept_results)
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



=end