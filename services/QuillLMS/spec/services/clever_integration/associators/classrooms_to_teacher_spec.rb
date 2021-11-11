require 'rails_helper'

describe 'CleverIntegration::Associators::ClassroomsToTeacher' do

  let!(:classroom1) { create(:classroom, :with_no_teacher) }
  let!(:classroom2) { create(:classroom, :with_no_teacher) }
  let!(:teacher1) { create(:teacher) }
  let!(:teacher2) { create(:teacher) }
  let!(:classrooms_teacher) { create(:classrooms_teacher, user: teacher1, classroom: classroom2)}

  context 'when the classroom has no owner' do
    it 'creates a classroom owner record' do
      CleverIntegration::Associators::ClassroomsToTeacher.run([classroom1], teacher1)
      expect(ClassroomsTeacher.find_by(classroom_id: classroom1.id, user_id: teacher1.id, role: 'owner')).to be
    end
  end

  context 'when the classroom has an owner and that owner is the passed teacher' do
    it 'creates a classroom owner record' do
      CleverIntegration::Associators::ClassroomsToTeacher.run([classroom2], teacher1)
      expect(ClassroomsTeacher.find_by(classroom_id: classroom2.id, user_id: teacher1.id, role: 'owner')).to be
    end
  end

  context 'when the classroom has an owner and that owner is not the passed teacher' do
    it 'creates a classroom owner record' do
      CleverIntegration::Associators::ClassroomsToTeacher.run([classroom2], teacher2)
      expect(ClassroomsTeacher.find_by(classroom_id: classroom2.id, user_id: teacher2.id, role: 'coteacher')).to be
    end
  end
end
