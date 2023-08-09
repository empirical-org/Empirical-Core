# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe StudentImportedClassroomsUpdater do
    subject { described_class.run(user) }

    let(:user) { create(:student) }
    let(:client) { double('client', student_classrooms: student_classrooms) }
    let(:external_classroom_id) { Faker::Number.number(12) }

    before { allow(ClientFetcher).to receive(:run).with(user).and_return(client) }

    context 'student has no google classrooms' do
      let(:student_classrooms) { [] }

      it { expect { subject }.not_to change { user.classrooms.count } }
    end

    context 'student has a google classroom' do
      let(:student_classrooms) { [{ external_classroom_id: external_classroom_id }] }

      it do
        expect(::Associators::StudentsToClassrooms).not_to receive(:run)
        subject
      end

      context 'classroom is already imported' do
        let!(:classroom) { create(:classroom, google_classroom_id: external_classroom_id) }

        it do
          expect(::Associators::StudentsToClassrooms).to receive(:run).with(user, classroom)
          subject
        end
      end
    end
  end
end
