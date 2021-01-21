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
#  index_teacher_saved_activities_on_activity_id  (activity_id)
#  index_teacher_saved_activities_on_teacher_id   (teacher_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#  fk_rails_...  (teacher_id => users.id)
#
require 'rails_helper'

RSpec.describe TeacherSavedActivity, type: :model do

  subject { create(:teacher_saved_activity) }

  it { should belong_to(:teacher).class_name('User') }
  it { should belong_to(:activity) }

  it { should validate_presence_of(:activity_id) }
  it { should validate_presence_of(:teacher_id) }
  it { should validate_uniqueness_of(:activity_id).scoped_to(:teacher_id) }
end
