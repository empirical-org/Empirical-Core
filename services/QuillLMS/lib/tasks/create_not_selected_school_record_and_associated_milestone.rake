# frozen_string_literal: true

namespace :not_selected_school_record_and_milestone do
  desc 'creates a school in the database called no school selected, a milestone for dismissing the reminders to select a school, and replaces all existing schools_users relationships to match the new school'
  task :create => :environment do
    no_school_selected_school = School.find_or_create_by(name: School::NO_SCHOOL_SELECTED_SCHOOL_NAME)
    not_listed_school = School.find_by(name: School::NOT_LISTED_SCHOOL_NAME)
    SchoolsUsers.where(school: not_listed_school).update(school: no_school_selected_school)
    Milestone.find_or_create_by(name: Milestone::TYPES[:dismiss_school_selection_reminder])
  end
end
