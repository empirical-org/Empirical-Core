# == Schema Information
#
# Table name: classroom_activities
#
#  id                   :integer          not null, primary key
#  assign_on_join       :boolean
#  assigned_student_ids :integer          is an Array
#  completed            :boolean          default(FALSE)
#  due_date             :datetime
#  locked               :boolean          default(FALSE)
#  pinned               :boolean          default(FALSE)
#  visible              :boolean          default(TRUE), not null
#  created_at           :datetime
#  updated_at           :datetime
#  activity_id          :integer
#  classroom_id         :integer
#  unit_id              :integer
#
# Indexes
#
#  index_classroom_activities_on_activity_id              (activity_id)
#  index_classroom_activities_on_classroom_id             (classroom_id)
#  index_classroom_activities_on_classroom_id_and_pinned  (classroom_id,pinned) UNIQUE WHERE (pinned = true)
#  index_classroom_activities_on_unit_id                  (unit_id)
#  index_classroom_activities_on_updated_at               (updated_at)
#
class ClassroomActivity < ActiveRecord::Base
  has_many :activity_sessions
  belongs_to :activity
end
