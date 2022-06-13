# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::ClassroomImporter do
  let(:teacher) { create(:teacher) }

  let(:data) do
    {
      google_classroom_id: google_classroom_id,
      name: 'Google classroom',
      teacher_id: teacher.id
    }
  end

  subject { described_class.run(data) }

  context 'classroom exists with google_classroom_id' do
    let(:google_classroom_id) { 123456 }

    before { create(:classroom, google_classroom_id: google_classroom_id, teacher_id: teacher.id) }

    it 'runs classroom updater' do
      expect { subject }.to_not change(Classroom, :count)
    end
  end

  context 'classroom does not exist with google_classroom_id' do
    let(:google_classroom_id) { 987654 }

    it 'creates a new classroom' do
      expect { subject }.to change(Classroom, :count).from(0).to(1)
    end
  end
end
