# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::DistrictStudentDataAdapter do
  include_context "Clever District Students Data"

  subject { described_class.run(student_data) }

  context 'student_data1: email and district_username are same' do
    let(:student_data) { student1_data }

    it { expect(subject).to eq student1_attrs }
  end

  context 'student_data2: email and district_username are different' do
    let(:student_data) { student2_data }

    it { expect(subject).to eq student2_attrs }
  end


  context 'student_data3: invalid email and nil district_username' do
    let(:student_data) { student3_data }

    it { expect(subject).to eq student3_attrs }
  end
end

