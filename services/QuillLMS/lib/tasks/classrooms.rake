# frozen_string_literal: true

require_relative './progress_bar'

namespace :classrooms do
  desc 'Purge activity history for a specified list of classroom ids'
  task :purge_histories, [:classroom_ids] => :environment do |t, args|
    classroom_ids = args[:classroom_ids].split

    classrooms = Classroom.where(id: classroom_ids)
    classrooms_teachers = ClassroomsTeacher.where(classroom_id: classroom_ids)
    classroom_units = ClassroomUnit.where(classroom_id: classroom_ids)
    activity_sessions = ActivitySession.where(classroom_unit: classroom_units)
    concept_results = ConceptResult.where(activity_session: activity_sessions)

    puts "You are about to permanently destroy #{classrooms&.count || 0} classrooms, #{classrooms_teachers&.count || 0} classrooms_teachers, #{classroom_units&.count || 0} classroom_units, #{activity_sessions&.count || 0} activity_sessions, and #{concept_results&.count || 0} concept_results records. Continue? [y/N]"
    input = $stdin.gets.chomp
    raise "Canceling task." unless input == "y"

    ActiveRecord::Base.transaction do
      concept_results&.destroy_all
      activity_sessions&.destroy_all
      classroom_units&.destroy_all
      classrooms_teachers&.destroy_all
      classrooms&.destroy_all
    end
  end
end
