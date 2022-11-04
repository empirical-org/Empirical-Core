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
#  phone_number                   :string
#  school_name                    :string
#  submission_type                :string           not null
#  teacher_premium_count_estimate :integer          default(0), not null
#  title                          :string
#  created_at                     :datetime         not null
#  updated_at                     :datetime         not null
#
require 'rails_helper'

RSpec.describe SalesFormSubmission, type: :model do
  let(:api_double) { double }

  before do
    allow(VitallyRestApi).to receive(:new).and_return(api_double)
  end

  context 'validations' do
    let(:sales_form_submission) { build(:sales_form_submission) }

    it { expect(sales_form_submission).to be_valid }
    it { should validate_presence_of(:first_name) }
    it { should validate_presence_of(:last_name) }
    it { should validate_presence_of(:email) }
    it { should validate_presence_of(:collection_type) }
    it { should validate_presence_of(:teacher_premium_count_estimate) }
    it { should validate_presence_of(:submission_type) }
  end

  context 'after_save, should perform this behavior on internal User records' do
    let(:school) { create(:school)}

    it 'creates a new user record if a User does not already exist' do
      expect { create(:sales_form_submission, school_name: school.name) }.to change(User, :count).by(1)
    end

    it 'creates a new user record with the email from the sales form submission' do
      sales_form_submission = create(:sales_form_submission, school_name: school.name)
      expect(User.find_by(email: sales_form_submission.email, role: User::SALES_CONTACT, name: "#{sales_form_submission.first_name} #{sales_form_submission.last_name}", title: sales_form_submission.title)).to be
    end

    it 'does not create a new user record if a User already exists' do
      user = create(:user)
      expect { create(:sales_form_submission, email: user.email, school_name: school.name) }.to change(User, :count).by(0)
    end
  end

  context 'after_save, it should enqueue Sidekiq jobs to sync data to Vitally and to send a Slack message' do
    it 'should enqueue jobs after save' do
      sales_form_submission = create(:sales_form_submission)

      expect(SyncSalesFormSubmissionToVitallyWorker).to receive(:perform_async).with(sales_form_submission.id)
      expect(SendSalesFormSubmissionToSlackWorker).to receive(:perform_async).with(sales_form_submission.id)

      sales_form_submission.created_at = Time.current
      sales_form_submission.save
    end
  end

end
