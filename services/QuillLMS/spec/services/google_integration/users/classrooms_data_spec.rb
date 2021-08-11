require 'rails_helper'

RSpec.describe GoogleIntegration::Users::ClassroomsData do
  let(:user) { create(:teacher) }

  subject { described_class.new(user, serialized_classrooms_data) }

  context 'no classrooms' do
    let(:serialized_classrooms_data) { { classrooms: [] }.to_json }

    it 'has no elements' do
      expect(subject.count).to eq 0
    end
  end

  context 'two classrooms' do
    let(:google_classroom_id_1) { 123 }
    let(:google_classroom_id_2) { 456 }

    let(:serialized_classrooms_data) do
      {
        classrooms: [
          { id: google_classroom_id_1 },
          { id: google_classroom_id_2 }
        ]
      }.to_json
    end

    let(:expected_classrooms_data) do
      [
        { google_classroom_id: google_classroom_id_1, teacher_id: user.id },
        { google_classroom_id: google_classroom_id_2, teacher_id: user.id }
      ]
    end

    it 'has two elements' do
      subject.each_with_index { |classroom_data, index| expect(classroom_data).to eq expected_classrooms_data[index] }
    end
  end
end
