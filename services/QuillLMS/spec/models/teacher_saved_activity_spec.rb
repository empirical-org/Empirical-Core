require 'rails_helper'

RSpec.describe TeacherSavedActivity, type: :model do
  it { should belong_to(:teacher).class_name('User') }
  it { should belong_to(:activity) }

  it { should validate_presence_of(:activity_id) }
  it { should validate_presence_of(:teacher_id) }
end
