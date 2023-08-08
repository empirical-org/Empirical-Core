# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe StudentUpdater do
    subject { described_class.run(student, data) }

    let(:account_type) { described_class::ACCOUNT_TYPE }
    let(:role) { described_class::ROLE }

    let(:email) { Faker::Internet.email }
    let(:user_external_id) { Faker::Number.number }

    let(:data) { { email: email, user_external_id: user_external_id } }

    context 'student has role student' do
      let(:student) { create(:student, email: email )}

      it { updates_student_attributes }
      it { expect { subject }.not_to change(ChangeLog, :count) }
    end

    context 'student has a clever_id' do
      let(:student) { create(:student, :signed_up_with_clever, email: email) }

      it { updates_student_attributes }
    end

    context 'student has role teacher' do
      let(:student) { create(:teacher, email: email )}

      it { updates_student_attributes }
      it { expect { subject }.to change(ChangeLog, :count).by(1) }
    end

    def updates_student_attributes
      subject
      student.reload

      expect(student.email).to eq email
      expect(student.role).to eq role
      expect(student.account_type).to eq account_type
      expect(student.google_id).to eq user_external_id
      expect(student.clever_id).to eq nil
    end
  end
end
