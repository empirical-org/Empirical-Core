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
#  school_premium_count_estimate  :integer          default(0), not null
#  student_premium_count_estimate :integer          default(0), not null
#  submission_type                :string           not null
#  teacher_premium_count_estimate :integer          default(0), not null
#  zipcode                        :string
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
    it { should validate_presence_of(:collection_type) }
    it { should validate_presence_of(:school_premium_count_estimate) }
    it { should validate_presence_of(:teacher_premium_count_estimate) }
    it { should validate_presence_of(:student_premium_count_estimate) }
    it { should validate_presence_of(:submission_type) }
  end

  context 'hooks' do
    it 'after_save, creates a new user record if a User does not already exist' do
      expect { create(:sales_form_submission) }.to change { User.count }.by(1)
    end

    it 'after_save, creates a new user record with the email from the sales form submission' do
      sales_form_submission = create(:sales_form_submission)
      expect(User.find_by(email: sales_form_submission.email, role: User::SALES_CONTACT)).to be
    end

    it 'after_save, does not create a new user record if a User already exists' do
      user = create(:user)
      expect { create(:sales_form_submission, email: user.email) }.to change { User.count }.by(0)
    end
  end

  context '#send_opportunity_to_vitally' do
    let(:school) { create(:school)}
    let(:sales_form_submission) { create(:sales_form_submission, collection_type: 'school', source: 'form', submission_type: 'quote request', school_name: school.name)}

    it 'should sync to vitally with the appropriate payload for school level forms' do
      vitally_rest_api = double.as_null_object
      allow(VitallyRestApi).to receive(:new).and_return(vitally_rest_api)
      payload = {
        templateId: SalesFormSubmission::SCHOOL_QUOTE_REQUEST_TEMPLATE_ID,
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
          source: SalesFormSubmission::FORM_SOURCE,
          intercom_link: '',
          metabase_id: sales_form_submission.id.to_s
        }
      }
      expect(vitally_rest_api).to receive(:create).with(SalesFormSubmission::VITALLY_SALES_FORMS_TYPE, payload)
      sales_form_submission.send_opportunity_to_vitally
    end

    it 'should sync to vitally with the appropriate payload for district level forms' do
      district = create(:district)
      sales_form_submission.update(collection_type: 'district', district_name: district.name, source: 'form')
      school.update(district: district)

      vitally_rest_api = double.as_null_object
      allow(VitallyRestApi).to receive(:new).and_return(vitally_rest_api)
      payload = {
        templateId: SalesFormSubmission::DISTRICT_QUOTE_REQUEST_TEMPLATE_ID,
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
          source: SalesFormSubmission::FORM_SOURCE,
          intercom_link: '',
          metabase_id: sales_form_submission.id.to_s
        }
      }
      expect(vitally_rest_api).to receive(:create).with(SalesFormSubmission::VITALLY_SALES_FORMS_TYPE, payload)
      sales_form_submission.send_opportunity_to_vitally
    end

    it 'should first create a school in vitally if it does not exist yet' do
      school = create(:school)
      sales_form_submission = create(:sales_form_submission, collection_type: 'school', submission_type: 'quote request', source: 'form', school_name: school.name)

      vitally_rest_api = double.as_null_object
      allow(VitallyRestApi).to receive(:new).and_return(vitally_rest_api)
      allow(vitally_rest_api).to receive(:exists?).with(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, school.id).and_return(false)

      expect(vitally_rest_api).to receive(:create).with(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, school.vitally_data)
      sales_form_submission.send_opportunity_to_vitally
    end

    it 'should first create a district in vitally if it does not exist yet' do
      district = create(:district)
      sales_form_submission = create(:sales_form_submission, collection_type: 'district', submission_type: 'quote request', district_name: district.name)

      vitally_rest_api = double.as_null_object
      allow(VitallyRestApi).to receive(:new).and_return(vitally_rest_api)
      allow(vitally_rest_api).to receive(:exists?).with(SalesFormSubmission::VITALLY_DISTRICTS_TYPE, district.id).and_return(false)

      expect(vitally_rest_api).to receive(:create).with(SalesFormSubmission::VITALLY_DISTRICTS_TYPE, district.vitally_data)
      sales_form_submission.send_opportunity_to_vitally
    end

    it 'should send a payload with the id for Unknown School if the school does not exist in the db' do
      school = create(:school, name: 'Unknown School')
      sales_form_submission = create(:sales_form_submission, collection_type: 'school', submission_type: 'quote request', school_name: 'nonexistent school name', source: 'form')

      vitally_rest_api = double.as_null_object
      allow(VitallyRestApi).to receive(:new).and_return(vitally_rest_api)
      allow(vitally_rest_api).to receive(:exists?).with(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, school.id).and_return(true)

      payload = {
        templateId: SalesFormSubmission::SCHOOL_QUOTE_REQUEST_TEMPLATE_ID,
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
          source: SalesFormSubmission::FORM_SOURCE,
          intercom_link: '',
          metabase_id: sales_form_submission.id.to_s
        }
      }
      expect(vitally_rest_api).to receive(:create).with(SalesFormSubmission::VITALLY_SALES_FORMS_TYPE, payload)
      sales_form_submission.send_opportunity_to_vitally
    end
  end
end
