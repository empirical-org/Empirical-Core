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
    it { should validate_presence_of(:school_premium_count_estimate) }
    it { should validate_presence_of(:teacher_premium_count_estimate) }
    it { should validate_presence_of(:student_premium_count_estimate) }
    it { should validate_presence_of(:submission_type) }
  end

  context 'after_save, should perform this behavior on internal User records' do
    let(:school) { create(:school)}

    before do
      # For this context block, we don't actually care about testing Vitally
      # behavior.  See below for those tests.
      allow_any_instance_of(SalesFormSubmission).to receive(:send_opportunity_to_vitally)
      allow_any_instance_of(SalesFormSubmission).to receive(:create_school_or_district_if_none_exist)
      allow_any_instance_of(SalesFormSubmission).to receive(:vitally_user_create_data)
      allow(api_double).to receive(:exists?).and_return(false)
      allow(api_double).to receive(:create)
    end

    it 'creates a new user record if a User does not already exist' do
      expect { create(:sales_form_submission, school_name: school.name) }.to change(User, :count).by(1)
    end

    it 'creates a new user record with the email from the sales form submission' do
      sales_form_submission = create(:sales_form_submission, school_name: school.name)
      expect(User.find_by(email: sales_form_submission.email, role: User::SALES_CONTACT)).to be
    end

    it 'does not create a new user record if a User already exists' do
      user = create(:user)
      expect { create(:sales_form_submission, email: user.email, school_name: school.name) }.to change(User, :count).by(0)
    end
  end

  context 'after_save, should perform these external calls on the Vitally API for schools, districts, and users' do

    it 'should create a school in vitally if it does not exist yet' do
      school = create(:school)
      sales_form_submission = build(:sales_form_submission, collection_type: 'school', submission_type: 'quote request', source: 'form', school_name: school.name)

      # We don't want to test behavior of this function in this test case
      expect(sales_form_submission).to receive(:create_vitally_user_if_none_exists)

      expect(api_double).to receive(:exists?).with(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, school.id).and_return(false)

      expect(api_double).to receive(:create).with(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, school.vitally_data)
      sales_form_submission.create_vitally_records_if_none_exist
    end

    it 'should create a district in vitally if it does not exist yet' do
      district = create(:district)
      sales_form_submission = build(:sales_form_submission, collection_type: 'district', submission_type: 'quote request', district_name: district.name)

      # We don't want to test behavior of this function in this test case
      expect(sales_form_submission).to receive(:create_vitally_user_if_none_exists)

      expect(api_double).to receive(:exists?).with(SalesFormSubmission::VITALLY_DISTRICTS_TYPE, district.id).and_return(false)

      expect(api_double).to receive(:create).with(SalesFormSubmission::VITALLY_DISTRICTS_TYPE, district.vitally_data)
      sales_form_submission.create_vitally_records_if_none_exist
    end

    it 'should create a user in vitally if it does not exist yet' do
      district = create(:district)
      user = create(:user)
      sales_form_submission = build(:sales_form_submission, collection_type: 'district', submission_type: 'quote request', district_name: district.name, email: user.email)

      # We don't want to test behavior of this function in this test case
      expect(sales_form_submission).to receive(:create_school_or_district_if_none_exist)
      expect(api_double).to receive(:get).with(SalesFormSubmission::VITALLY_DISTRICTS_TYPE, district.id).and_return({'id' => district.id})

      expect(api_double).to receive(:exists?).with(SalesFormSubmission::VITALLY_USERS_TYPE, user.id).and_return(false)
      expect(api_double).to receive(:create).with(SalesFormSubmission::VITALLY_USERS_TYPE, sales_form_submission.vitally_user_create_data)

      sales_form_submission.create_vitally_records_if_none_exist
    end

    it 'should update the user in vitally if it does exist' do
      district = create(:district)
      user = create(:user)
      sales_form_submission = build(:sales_form_submission, collection_type: 'district', submission_type: 'quote request', district_name: district.name, email: user.email)

      # We don't want to test behavior of this function in this test case
      expect(sales_form_submission).to receive(:create_school_or_district_if_none_exist)
      expect(api_double).to receive(:get).with(SalesFormSubmission::VITALLY_DISTRICTS_TYPE, district.id).and_return({'id' => district.id})

      expect(api_double).to receive(:exists?).with(SalesFormSubmission::VITALLY_USERS_TYPE, user.id).and_return(true)
      expect(api_double).to receive(:update).with(SalesFormSubmission::VITALLY_USERS_TYPE, user.id, sales_form_submission.vitally_user_update_data)

      sales_form_submission.create_vitally_records_if_none_exist
    end
  end

  context 'after_save, should perform this external call to create a project through the Vitally API' do
    let(:school) { create(:school)}

    it 'should send the appropriate payload for forms with a school collection type' do
      vitally_school_id = '123'
      expect(api_double).to receive(:get).with(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, school.id).and_return({'id' => vitally_school_id})

      sales_form_submission = build(:sales_form_submission, collection_type: 'school', source: SalesFormSubmission::FORM_SOURCE, submission_type: 'quote request', school_name: school.name)
      allow(sales_form_submission).to receive(:vitally_callbacks)
      sales_form_submission.save!

      payload = {
        templateId: SalesFormSubmission::SCHOOL_QUOTE_REQUEST_TEMPLATE_ID,
        customerId: vitally_school_id,
        traits: {
          'vitally.custom.name': "#{sales_form_submission.first_name} #{sales_form_submission.last_name}",
          'vitally.custom.email': sales_form_submission.email,
          'vitally.custom.phoneNumber': sales_form_submission.phone_number,
          'vitally.custom.schoolName': sales_form_submission.school_name,
          'vitally.custom.districtName': sales_form_submission.district_name,
          'vitally.custom.zipCode': sales_form_submission.zipcode,
          'vitally.custom.numberOfSchools': sales_form_submission.school_premium_count_estimate,
          'vitally.custom.numberOfTeachers': sales_form_submission.teacher_premium_count_estimate,
          'vitally.custom.numberOfStudents': sales_form_submission.student_premium_count_estimate,
          'vitally.custom.formComments': sales_form_submission.comment,
          'vitally.custom.opportunitySource': SalesFormSubmission::FORM_SOURCE,
          'vitally.custom.intercomLink': nil,
          'vitally.custom.metabaseId': sales_form_submission.id
        }
      }
      expect(api_double).to receive(:create).with(SalesFormSubmission::VITALLY_SALES_FORMS_TYPE, payload)
      sales_form_submission.send_opportunity_to_vitally
    end

    it 'should send the appropriate payload for forms with a district collection type' do
      district = create(:district)
      sales_form_submission = build(:sales_form_submission, collection_type: 'district', source: SalesFormSubmission::FORM_SOURCE, submission_type: 'quote request', district_name: district.name)
      school.update(district: district)

      vitally_organization_id = '123'
      expect(api_double).to receive(:get).with(SalesFormSubmission::VITALLY_DISTRICTS_TYPE, district.id).and_return({'id' => vitally_organization_id})

      allow(sales_form_submission).to receive(:vitally_callbacks)
      sales_form_submission.save!


      payload = {
        templateId: SalesFormSubmission::SCHOOL_QUOTE_REQUEST_TEMPLATE_ID,
        organizationId: vitally_organization_id,
        traits: {
          'vitally.custom.name': "#{sales_form_submission.first_name} #{sales_form_submission.last_name}",
          'vitally.custom.email': sales_form_submission.email,
          'vitally.custom.phoneNumber': sales_form_submission.phone_number,
          'vitally.custom.schoolName': sales_form_submission.school_name,
          'vitally.custom.districtName': sales_form_submission.district_name,
          'vitally.custom.zipCode': sales_form_submission.zipcode,
          'vitally.custom.numberOfSchools': sales_form_submission.school_premium_count_estimate,
          'vitally.custom.numberOfTeachers': sales_form_submission.teacher_premium_count_estimate,
          'vitally.custom.numberOfStudents': sales_form_submission.student_premium_count_estimate,
          'vitally.custom.formComments': sales_form_submission.comment,
          'vitally.custom.opportunitySource': SalesFormSubmission::FORM_SOURCE,
          'vitally.custom.intercomLink': nil,
          'vitally.custom.metabaseId': sales_form_submission.id
        }
      }
      expect(api_double).to receive(:create).with(SalesFormSubmission::VITALLY_SALES_FORMS_TYPE, payload)
      sales_form_submission.send_opportunity_to_vitally
    end

    it 'should send a payload with the id for Unknown School if the school does not exist in the db' do
      school = create(:school, name: 'Unknown School')
      sales_form_submission = build(:sales_form_submission, collection_type: 'school', submission_type: 'quote request', school_name: 'nonexistent school name', source: SalesFormSubmission::FORM_SOURCE)
      allow(sales_form_submission).to receive(:vitally_callbacks)
      sales_form_submission.save!

      vitally_school_id = '123'
      expect(api_double).to receive(:get).with(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, school.id).and_return({'id' => vitally_school_id})

      allow(api_double).to receive(:exists?).with(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, school.id).and_return(false)
      allow(api_double).to receive(:get).with(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, school.id).and_return({id: 'schoolId'})

      payload = {
        templateId: SalesFormSubmission::SCHOOL_QUOTE_REQUEST_TEMPLATE_ID,
        customerId: vitally_school_id,
        traits: {
          "vitally.custom.name": "#{sales_form_submission.first_name} #{sales_form_submission.last_name}",
          "vitally.custom.email": sales_form_submission.email,
          "vitally.custom.phoneNumber": sales_form_submission.phone_number,
          "vitally.custom.schoolName": sales_form_submission.school_name,
          "vitally.custom.districtName": sales_form_submission.district_name,
          "vitally.custom.zipCode": sales_form_submission.zipcode,
          "vitally.custom.numberOfSchools": sales_form_submission.school_premium_count_estimate,
          "vitally.custom.numberOfTeachers": sales_form_submission.teacher_premium_count_estimate,
          "vitally.custom.numberOfStudents": sales_form_submission.student_premium_count_estimate,
          "vitally.custom.formComments": sales_form_submission.comment,
          "vitally.custom.opportunitySource": SalesFormSubmission::FORM_SOURCE,
          "vitally.custom.intercomLink": nil,
          "vitally.custom.metabaseId": sales_form_submission.id
        }
      }
      expect(api_double).to receive(:create).with(SalesFormSubmission::VITALLY_SALES_FORMS_TYPE, payload)
      sales_form_submission.send_opportunity_to_vitally
    end
  end
end
