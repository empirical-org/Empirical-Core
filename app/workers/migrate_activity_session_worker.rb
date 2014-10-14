class MigrateActivitySessionWorker
  include Sidekiq::Worker

  def perform(id)

    as = activity_session = ActivitySession.unscoped.find(id)


    updates = {}

    # deal with classroom activity first....

    if activity_session.classroom_activity
      updates[:activity_id] = activity_session.classroom_activity.activity_id
    end

    # fix if temporary is nil...
    updates[:temporary] = false if activity_session.temporary.nil?

    # now fix timestamps and such

    if as.created_at.nil?

      if !as.updated_at.nil?
        updates[:created_at] = as.updated_at
      elsif !as.completed_at.nil?
        updates[:created_at] = as.completed_at - 10.minutes
      else
        updates[:created_at] = 1.year.ago
      end

      updates[:updated_at] = updates[:created_at] if as.updated_at.nil?
      updates[:started_at] = updates[:created_at] if as.started_at.nil?
    else
      updates[:updated_at] = as.created_at if as.updated_at.nil?
      updates[:started_at] = as.created_at if as.started_at.nil?
    end

    if as.time_spent.nil? && !as.completed_at.nil?
      updates[:time_spent] = as.completed_at.to_f - updates[:started_at].to_f
    end

    as.update_columns(updates) if updates.any?
  end


end
