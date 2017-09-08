require 'rails_helper'

describe StudentsClassrooms, type: :model do

  context "it listens to the coder" do
    it "makes one student classroom and no students if told to" do
      StudentsClassrooms.create!(classroom_id: 1, student_id: 1)
      expect(StudentsClassrooms.all.count).to eq(1)
      expect(User.where(role: 'student').count).to eq(0)
      expect(Classroom.all.count).to eq(0)
    end
  end

end
