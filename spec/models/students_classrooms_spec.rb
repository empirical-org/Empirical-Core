require 'rails_helper'

describe StudentsClassrooms, type: :model, redis: :true do
  let!(:classroom) { FactoryGirl.create(:classroom) }
  let!(:new_student) { FactoryGirl.create(:student) }

  context '#invalidate_student_count' do
    before(:each) do
      $redis.set("classroom_id:#{classroom.id}_student_count", classroom.students.count, {ex: 7.days})
    end

    it 'deletes the cached count of students' do
      new_students_classroom = StudentsClassrooms.create(classroom_id: classroom.id, student_id: new_student.id)
      new_students_classroom.invalidate_student_count
      expect($redis.get("classroom_id:#{classroom.id}_student_count")).not_to be
    end
  end

end
