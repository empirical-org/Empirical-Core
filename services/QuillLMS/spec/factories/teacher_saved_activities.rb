# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_saved_activities
#
#  id          :integer          not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  activity_id :integer          not null
#  teacher_id  :integer          not null
#
# Indexes
#
#  index_teacher_saved_activities_on_activity_id                 (activity_id)
#  index_teacher_saved_activities_on_teacher_id                  (teacher_id)
#  index_teacher_saved_activities_on_teacher_id_and_activity_id  (teacher_id,activity_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#  fk_rails_...  (teacher_id => users.id)
#
FactoryBot.define do
  factory :teacher_saved_activity do
    activity { Activity.last || create(:activity) }
    teacher  { User.find_by(role: 'teacher') || create(:teacher) }
  end
end
