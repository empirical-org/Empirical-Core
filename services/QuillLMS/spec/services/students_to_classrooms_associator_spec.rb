require 'rails_helper'

describe 'Associators:StudentsToClassrooms' do

  let!(:teacher) {create(:teacher) }
  let!(:student) {create(:student)}
  let!(:classroom) {create(:classroom, teacher_id: teacher.id) }

  describe 'when the classroom and student are both extent' do
    it "creates a new student classroom object" do
      old_sc_count = StudentsClassrooms.count
      Associators::StudentsToClassrooms.run(student, classroom)
      expect(StudentsClassrooms.count).to eq(old_sc_count + 1)
    end
  end

  describe "when the classroom or teacher has a problem" do

    it "will not add a students classroom if the classroom does not exist" do
      classroom.destroy!
      old_sc_count = StudentsClassrooms.count
      Associators::StudentsToClassrooms.run(student, classroom)
      expect(StudentsClassrooms.count).to eq(old_sc_count)
    end

    it "will not add a students classroom if the classroom is not visible" do
      classroom.update(visible: false)
      old_sc_count = StudentsClassrooms.count
      Associators::StudentsToClassrooms.run(student, classroom)
      expect(StudentsClassrooms.count).to eq(old_sc_count)
    end

    it "will not add a students classroom if the the classroom teacher does not exist" do
      classroom.owner.destroy
      old_sc_count = StudentsClassrooms.count
      Associators::StudentsToClassrooms.run(student, classroom)
      expect(StudentsClassrooms.count).to eq(old_sc_count)
    end

  end



end
