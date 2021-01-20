require 'rails_helper'

RSpec.describe TeacherSavedActivity, type: :model do

  subject { create(:teacher_saved_activity) }

  it { should belong_to(:teacher).class_name('User') }
  it { should belong_to(:activity) }

  it { should validate_presence_of(:activity_id) }
  it { should validate_presence_of(:teacher_id) }
  it { should validate_uniqueness_of(:activity_id).scoped_to(:teacher_id) }
end
