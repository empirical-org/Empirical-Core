# frozen_string_literal: true

# == Schema Information
#
# Table name: sales_form_submissions
#
#  id                             :bigint           not null, primary key
#  collection_type                :string           not null
#  comment                        :text             default("")
#  district_name                  :string
#  email                          :string           not null
#  first_name                     :string           not null
#  last_name                      :string           not null
#  phone_number                   :string           not null
#  school_name                    :string
#  school_premium_count_estimate  :integer          default(0), not null
#  student_premium_count_estimate :integer          default(0), not null
#  submission_type                :string           not null
#  teacher_premium_count_estimate :integer          default(0), not null
#  zipcode                        :string           not null
#  created_at                     :datetime         not null
#  updated_at                     :datetime         not null
#
require 'rails_helper'

RSpec.describe SalesFormSubmission, type: :model do
  context 'validations' do
    let(:sales_form_submission) { build(:sales_form_submission) }

    it { expect(sales_form_submission).to be_valid }
    it { should validate_presence_of(:first_name) }
    it { should validate_presence_of(:last_name) }
    it { should validate_presence_of(:email) }
    it { should validate_presence_of(:phone_number) }
    it { should validate_presence_of(:zipcode) }
    it { should validate_presence_of(:collection_type) }
    it { should validate_presence_of(:school_premium_count_estimate) }
    it { should validate_presence_of(:teacher_premium_count_estimate) }
    it { should validate_presence_of(:student_premium_count_estimate) }
    it { should validate_presence_of(:submission_type) }
  end
  context 'school name validation with blank district name' do
    let(:sales_form_submission) { build(:sales_form_submission, district_name: '') }

    it { expect(sales_form_submission).to be_valid }
    it { should validate_presence_of(:school_name) }
    it { should validate_presence_of(:district_name) }
  end
  context 'district name validation with blank school name' do
    let(:sales_form_submission) { build(:sales_form_submission, school_name: '') }

    it { expect(sales_form_submission).to be_valid }
    it { should validate_presence_of(:school_name) }
    it { should validate_presence_of(:district_name) }
  end
end
