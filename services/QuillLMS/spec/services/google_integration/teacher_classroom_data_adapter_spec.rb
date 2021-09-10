require 'rails_helper'

RSpec.describe GoogleIntegration::TeacherClassroomDataAdapter do
  subject { described_class.new(user, data) }

  let(:updated_data) { subject.run }
  let(:user) { create(:user, role: role) }

  context 'valid data' do
    let(:google_classroom_id) { 32432423 }
    let(:data) { { id: google_classroom_id } }

    context 'teacher' do
      let(:role) { 'teacher' }

      it 'correctly updates data' do
        expect(updated_data[:google_classroom_id]).to eq google_classroom_id
        expect(updated_data[:teacher_id]).to eq user.id
      end
    end

    context 'student' do
      let(:role) { 'student' }

      it 'correctly updates data' do
        expect(updated_data[:google_classroom_id]).to eq google_classroom_id
        expect(updated_data[:student_id]).to eq user.id
      end
    end
  end
end

