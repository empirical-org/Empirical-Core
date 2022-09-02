# frozen_string_literal: true

namespace :not_selected_school_record do
  desc 'creates a school in the database called no school selected and replaces all existing schools_users relationships to match it'
  task :create => :environment do
    no_school_selected_school = School.find_or_create_by(name: School::NO_SCHOOL_SELECTED_SCHOOL_NAME)
    not_listed_school = School.find_by(name: School::NOT_LISTED_SCHOOL_NAME)
    SchoolsUsers.where(school_id: not_listed_school).update(school_id: no_school_selected_school)
  end
end
