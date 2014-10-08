class ChangesToActivitySession < ActiveRecord::Migration
  def change

    change_column :activity_sessions, :temporary, :boolean, default: 'f'
    add_column    :activity_sessions, :started_at, :timestamp

    add_index :activity_sessions, :started_at
    add_index :activity_sessions, :completed_at

    puts "completed index/column creation"
    # fix the missing data....
    ActivitySession.unscoped.where(temporary: nil).update_all(temporary: 'f')

    puts "completed temporary set"
    # now fix timestamps and such
    ActivitySession.unscoped.started_or_better.each do |as|
      updates = {}

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

      as.update_columns(updates)
    end

    puts "completed timestamp jostling"
  end
end
