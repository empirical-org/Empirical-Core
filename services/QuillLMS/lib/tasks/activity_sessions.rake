# frozen_string_literal: true

namespace :activity_sessions do
  namespace :backfill do
    desc 'backfills updated_at so null values do not exist'
    task :updated_at => :environment do
      sessions = ActivitySession.unscoped.where(updated_at: nil)
      sessions.each do |session|
        backfill_value = session.completed_at || session.created_at || DateTime.new(2014,4,1)
        puts "updating ActivitySession with id #{session.id}"
        session.update_columns(
          updated_at: backfill_value,
          created_at: DateTime.new(2014,4,1)
        )
      end
    end
  end
end
