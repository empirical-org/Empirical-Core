require 'rails_helper'

RSpec.describe TeacherSavedActivity, type: :model do
  it { should validate_presence_of(:activity_id) }
  it { should validate_presence_of(:teacher_id) }
end
