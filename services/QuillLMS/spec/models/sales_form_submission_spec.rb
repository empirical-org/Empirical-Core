# frozen_string_literal: true

# == Schema Information
#
# Table name: sales_form_submissions
#
#  id                             :bigint           not null, primary key
#  collection_type                :string           not null
#  comment                        :text             default("")
#  district_name                  :string           not null
#  email                          :string           not null
#  first_name                     :string           not null
#  last_name                      :string           not null
#  phone_number                   :string           not null
#  school_name                    :string           not null
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
    it { should validate_presence_of(:school_name) }
    it { should validate_presence_of(:district_name) }
    it { should validate_presence_of(:school_premium_count_estimate) }
    it { should validate_presence_of(:teacher_premium_count_estimate) }
    it { should validate_presence_of(:student_premium_count_estimate) }
    it { should validate_presence_of(:submission_type) }
  end

  context '#sync_to_vitally' do
    let(:school) { create(:school)}
    let(:sales_form_submission) { create(:sales_form_submission, collection_type: 'school', submission_type: 'quote request', school_name: school.name)}

    it 'should sync to vitally with the appropriate payload for school level forms' do
      vitally_rest_api = double
      allow(VitallyRestApi).to receive(:new).and_return(vitally_rest_api)
      payload = {
        templateId: "3faf0814-724d-4bb1-b56b-f854dfd23db8",
        customerId: school.id.to_s,
        traits: {
          name: "#{sales_form_submission.first_name} #{sales_form_submission.last_name}",
          email: sales_form_submission.email,
          phone_number: sales_form_submission.phone_number,
          school_name: sales_form_submission.school_name,
          district_name: sales_form_submission.district_name,
          zip_code: sales_form_submission.zipcode,
          number_of_schools: sales_form_submission.school_premium_count_estimate,
          number_of_teachers: sales_form_submission.teacher_premium_count_estimate,
          number_of_students: sales_form_submission.student_premium_count_estimate,
          form_comments: sales_form_submission.comment,
          source: 'form',
          intercom_link: '',
          sales_form_submission_id: sales_form_submission.id.to_s
        }
      }
      expect(vitally_rest_api).to receive(:create).with('projects', payload)
      sales_form_submission.sync_to_vitally
    end

    it 'should sync to vitally with the appropriate payload for district level forms' do
      district = create(:district)
      sales_form_submission.update(collection_type: 'district', district_name: district.name)
      school.update(district: district)

      vitally_rest_api = double
      allow(VitallyRestApi).to receive(:new).and_return(vitally_rest_api)
      payload = {
        templateId: "a96a963b-c1d4-4b33-94bb-f9a593046927",
        organizationId: district.id.to_s,
        traits: {
          name: "#{sales_form_submission.first_name} #{sales_form_submission.last_name}",
          email: sales_form_submission.email,
          phone_number: sales_form_submission.phone_number,
          school_name: sales_form_submission.school_name,
          district_name: sales_form_submission.district_name,
          zip_code: sales_form_submission.zipcode,
          number_of_schools: sales_form_submission.school_premium_count_estimate,
          number_of_teachers: sales_form_submission.teacher_premium_count_estimate,
          number_of_students: sales_form_submission.student_premium_count_estimate,
          form_comments: sales_form_submission.comment,
          source: 'form',
          intercom_link: '',
          sales_form_submission_id: sales_form_submission.id.to_s
        }
      }
      expect(vitally_rest_api).to receive(:create).with('projects', payload)
      sales_form_submission.sync_to_vitally
    end
  end
end
