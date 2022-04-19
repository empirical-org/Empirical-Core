# frozen_string_literal: true

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
    it { should validate_presence_of(:school_name) }
    it { should validate_presence_of(:district_name) }
    it { should validate_presence_of(:school_premium_count_estimate) }
    it { should validate_presence_of(:teacher_premium_count_estimate) }
    it { should validate_presence_of(:student_premium_count_estimate) }
    it { should validate_presence_of(:submission_type) }
  end
end
