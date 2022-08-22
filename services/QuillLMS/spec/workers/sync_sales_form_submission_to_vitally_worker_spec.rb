# frozen_string_literal: true

require 'rails_helper'

describe SyncSalesFormSubmissionToVitallyWorker do
  subject { described_class.new }

  let(:sales_form_submission) { create(:sales_form_submission) }
  let!(:stub_api) { double }

  before do
    allow(VitallyRestApi).to receive(:new).and_return(stub_api)

    subject.sales_form_submission=(sales_form_submission)
  end

  describe '#perform' do
    it 'should run all three steps: create school/district in vitally, create user in vitally, send opportunity to vitally' do
      create(:school, name: sales_form_submission.school_name)

      fake_id = 1

      expect(SalesFormSubmission).to receive(:find).with(fake_id).and_return(sales_form_submission)

      # Test expected call through create_school_or_district_if_none_exist
      expect(stub_api).to receive(:create_unless_exists).with(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, sales_form_submission.school.id, sales_form_submission.school.vitally_data)

      # Test expected call through create_vitally_user_if_non_exists
      allow(stub_api).to receive(:get).with(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, anything).and_return({})
      expect(stub_api).to receive(:exists?).with(SalesFormSubmission::VITALLY_USERS_TYPE, anything).and_return(false)
      expect(stub_api).to receive(:create).with(SalesFormSubmission::VITALLY_USERS_TYPE, anything)

      # Test expected call through send_opportunity_to_vitally
      expect(stub_api).to receive(:create).with(SalesFormSubmission::VITALLY_SALES_FORMS_TYPE, sales_form_submission.vitally_sales_form_data)

      subject.perform(fake_id)
    end
  end

  context '#create_school_or_district_if_none_exist' do
    it 'should create a Vitally district if none exists' do
      district = create(:district)
      sales_form_submission.update(collection_type: SalesFormSubmission::DISTRICT_COLLECTION_TYPE, district_name: district.name)

      expect(stub_api).to receive(:create_unless_exists).with(SalesFormSubmission::VITALLY_DISTRICTS_TYPE, district.id, district.vitally_data)

      subject.create_school_or_district_if_none_exist
    end

    it 'should create a Vitally school if none exists' do
      school = create(:school)
      sales_form_submission.update(collection_type: SalesFormSubmission::SCHOOL_COLLECTION_TYPE, school_name: school.name)

      expect(stub_api).to receive(:create_unless_exists).with(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, school.id, school.vitally_data)

      subject.create_school_or_district_if_none_exist
    end
  end

  context '#create_vitally_user_if_none_exists' do
    let(:district) { create(:district) }
    let(:user) { create(:user) }
    let(:clean_sales_form_submission) { create(:sales_form_submission, collection_type: SalesFormSubmission::DISTRICT_COLLECTION_TYPE, district_name: district.name, email: user.email) }

    before do
      subject.sales_form_submission = clean_sales_form_submission
    end

    it 'should create a Vitally user if none exists' do
      expect(stub_api).to receive(:exists?).with(SalesFormSubmission::VITALLY_USERS_TYPE, user.id).and_return(false)

      expect(stub_api).to receive(:get).with(SalesFormSubmission::VITALLY_DISTRICTS_TYPE, district.id).and_return({'id' => district.id})
      expect(stub_api).to receive(:create).with(SalesFormSubmission::VITALLY_USERS_TYPE, subject.send(:vitally_user_create_data))

      subject.create_vitally_user_if_none_exists
    end

    it 'should update a Vitally user if one already exists' do
      expect(stub_api).to receive(:exists?).with(SalesFormSubmission::VITALLY_USERS_TYPE, user.id).and_return(true)

      expect(stub_api).to receive(:get).with(SalesFormSubmission::VITALLY_DISTRICTS_TYPE, district.id).and_return({'id' => district.id})
      expect(stub_api).to receive(:update).with(SalesFormSubmission::VITALLY_USERS_TYPE, user.id, subject.send(:vitally_user_update_data))

      subject.create_vitally_user_if_none_exists
    end
  end

  context '#send_opportunity_to_vitally' do
    it 'should send the appropriate payload for forms with a school collection type' do
      school = create(:school)
      vitally_school_id = '123'
      expect(stub_api).to receive(:get).with(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, school.id).and_return({'id' => vitally_school_id})

      sales_form_submission.update(collection_type: SalesFormSubmission::SCHOOL_COLLECTION_TYPE, source: SalesFormSubmission::FORM_SOURCE, submission_type: 'quote request', school_name: school.name)

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

      expect(stub_api).to receive(:create).with(SalesFormSubmission::VITALLY_SALES_FORMS_TYPE, payload)

      subject.send_opportunity_to_vitally
    end

    it 'should send the appropriate payload for forms with a district collection type' do
      district = create(:district)
      school = create(:school, district: district)
      sales_form_submission.update(collection_type: SalesFormSubmission::DISTRICT_COLLECTION_TYPE, source: SalesFormSubmission::FORM_SOURCE, submission_type: 'quote request', district_name: district.name)

      vitally_organization_id = '123'
      expect(stub_api).to receive(:get).with(SalesFormSubmission::VITALLY_DISTRICTS_TYPE, district.id).and_return({'id' => vitally_organization_id})

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

      expect(stub_api).to receive(:create).with(SalesFormSubmission::VITALLY_SALES_FORMS_TYPE, payload)

      subject.send_opportunity_to_vitally
    end

    it 'should send a payload with the id for Unknown School if the school does not exist in the db' do
      school = create(:school, name: 'Unknown School')
      sales_form_submission.update(collection_type: SalesFormSubmission::SCHOOL_COLLECTION_TYPE, submission_type: 'quote request', school_name: 'nonexistent school name', source: SalesFormSubmission::FORM_SOURCE)

      vitally_school_id = '123'
      expect(stub_api).to receive(:get).with(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, school.id).and_return({'id' => vitally_school_id})

      allow(stub_api).to receive(:get).with(SalesFormSubmission::VITALLY_SCHOOLS_TYPE, school.id).and_return({id: 'schoolId'})

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

      expect(stub_api).to receive(:create).with(SalesFormSubmission::VITALLY_SALES_FORMS_TYPE, payload)

      subject.send_opportunity_to_vitally
    end
  end
end
