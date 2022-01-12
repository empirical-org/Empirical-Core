# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::LibraryStudentDataAdapter do
  include_context "Clever Library Students Data"

  subject { described_class.run(student_data) }

  context 'student_data1' do
    let(:student_data) { student1_data }

    it { expect(subject).to eq student1_attrs }
  end

  context 'student_data2' do
    let(:student_data) { student2_data }

    it { expect(subject).to eq student2_attrs }

    context 'with email' do
      let(:email) { 'student@email.com' }

      before { student_data['data']['email'] = email }

      it { expect(subject).to eq student2_attrs.merge(email: email) }
    end

    context 'with invalid email' do
      before { student_data['data']['email'] = 'not-a-valid-email' }

      it { expect(subject).to eq student2_attrs }
    end
  end
end

