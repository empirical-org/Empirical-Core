# frozen_string_literal: true

require_relative './progress_bar'

namespace :classrooms do
  desc 'Purge activity history for a specified list of classroom ids'
  task :purge_histories, [:classroom_ids] => :environment do |t, args|
    classroom_ids = args[:classroom_ids].split

    classroom_units = ClassroomUnit.where(classroom_id: classroom_ids)
    activity_sessions = ActivitySession.where(classroom_unit: classroom_units)

    puts "You are about to irreversibly orphan #{activity_sessions&.count || 0} activity_sessions. Continue? [y/N]"
    input = $stdin.gets.chomp
    raise "Canceling task." unless input == "y"

    ActiveRecord::Base.transaction do
      activity_sessions.update_all(user_id: nil, classroom_unit_id: nil)
    end
  end
end
