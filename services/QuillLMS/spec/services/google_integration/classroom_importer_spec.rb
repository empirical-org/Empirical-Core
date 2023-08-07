# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe ClassroomImporter do
    let(:teacher) { create(:teacher) }

    let(:data) do
      {
        classroom_external_id: classroom_external_id,
        name: 'Google classroom',
        teacher_id: teacher.id
      }
    end

    subject { described_class.run(data) }

    context 'classroom exists with classroom_external_id' do
      let(:classroom_external_id) { 123456 }

      before { create(:classroom, google_classroom_id: classroom_external_id) }

      it 'runs classroom updater' do
        expect { subject }.to_not change(Classroom, :count)
      end
    end

    context 'classroom does not exist with classroom_external_id' do
      let(:classroom_external_id) { 987654 }

      it 'creates a new classroom' do
        expect { subject }.to change(Classroom, :count).from(0).to(1)
      end
    end
  end
end
