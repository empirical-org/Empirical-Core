# == Schema Information
#
# Table name: objectives
#
#  id                :integer          not null, primary key
#  action_url        :string
#  archived          :boolean          default(FALSE)
#  help_info         :string
#  name              :string
#  section           :string
#  section_placement :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
class Objective < ActiveRecord::Base
  has_many :checkboxes
  has_many :users, through: :checkboxes

  CREATE_A_CLASSROOM = "Create a Classroom"
  ADD_STUDENTS = "Add Students"
  ASSIGN_ENTRY_DIAGNOSTIC = "Assign Entry Diagnostic"
  BUILD_YOUR_OWN_ACTIVITY_PACK = "Build Your Own Activity Pack"
  ASSIGN_FEATURED_ACTIVITY_PACK = "Assign Featured Activity Pack"
  ADD_SCHOOL = "Add School"
  PUBLISH_CUSTOMIZED_LESSON = "Publish Customized Lesson"

  ORDERED_GETTING_STARTED_OBJECTIVE_NAMES = [
    ASSIGN_ENTRY_DIAGNOSTIC,
    ASSIGN_FEATURED_ACTIVITY_PACK,
    CREATE_A_CLASSROOM,
    ADD_STUDENTS,
    ADD_SCHOOL
  ]
end
