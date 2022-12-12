# frozen_string_literal: true

require 'csv'

namespace :reports do
  # Example invocation:
  #   rake 'reports:diagnostic_scores_by_school_and_class[1 2]'
  desc 'Diagnostic scores by school and class'
  task :diagnostic_scores_by_school_and_class, [:space_separated_school_ids, :space_separated_unit_template_ids] => :environment do |t,args|
    default_unit_template_ids = '99,100,126,154,193,194,195,299,300,217,237,409,411,444,445'
    unit_template_ids = args[:space_separated_unit_template_ids] ? args[:unit_template_ids].split.join(',') : default_unit_template_ids
    school_ids = args[:space_separated_school_ids].split.join(',')

    activity_session_rows = ActiveRecord::Base.connection.execute("
      select schools.name AS SchoolName, activity_sessions.id AS ActivitySessionId, classroom_units.created_at as AssignDate, classrooms.name as Class, users.name as StudentName, activities.name as Activity
      from schools
      join schools_users
      on schools.id = schools_users.school_id
      join classrooms_teachers
      on schools_users.user_id = classrooms_teachers.user_id
      join classrooms
      on classrooms.teacher_id = schools_users.user_id or classrooms.id=classrooms_teachers.classroom_id
      join classroom_units
      on classroom_units.classroom_id = classrooms.id
      join units
      on classroom_units.unit_id = units.id
      join activity_sessions
      on activity_sessions.classroom_unit_id = classroom_units.id
      join users
      on users.id = activity_sessions.user_id
      join activities
      on activity_sessions.activity_id = activities.id
      where schools.id IN (#{school_ids})
      and classrooms.visible = 'true'
      and units.unit_template_id IN (#{unit_template_ids})
      and activity_sessions.state = 'finished'
      group by schools.name, classroom_units.created_at, classrooms.name, users.name, activities.name, activity_sessions.id
      order by classrooms.name, users.name
    ").to_a

    activity_session_rows_with_skill_scores = activity_session_rows.map do |row|
      activity_session = ActivitySession.unscoped.find(row['activitysessionid'])
      skills = activity_session.activity.skills
      number_of_correct_skills = 0
      all_concept_results = activity_session.concept_results
      skills.each do |skill|
        concept_results = all_concept_results.select {|cr| cr.concept_id.in?(skill.concept_ids)}
        number_correct = concept_results.select(&:correct).length
        number_incorrect = concept_results.reject(&:correct).length
        number_of_correct_skills += 1 if number_incorrect == 0 && number_correct > 0
      end
      row['Score'] = ((number_of_correct_skills/skills.count.to_f) * 100).round(2)
      row
    end

    if activity_session_rows_with_skill_scores.empty?
      puts "No scores."
      exit 0
    end

    report = CSV.generate do |csv|
      csv << activity_session_rows_with_skill_scores.first.keys
      activity_session_rows_with_skill_scores.each do |hash|
        csv << hash.values
      end
    end

    $stdout.puts report
  end
end
