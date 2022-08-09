# frozen_string_literal: true

require 'rails_helper'

describe SalesFormSubmissionController, type: :controller do

  describe '#create' do
    let!(:school) { create(:school) }

    before do
      allow(HTTParty).to receive(:get)
      allow(HTTParty).to receive(:put)
      allow(HTTParty).to receive(:post)
    end

    it 'should create sales_form_submission entry' do
      expect do
        post :create, params: {
          sales_form_submission: {
            first_name: 'Bianca',
            last_name: 'Del Rio',
            email: 'test@gmail.com',
            phone_number: '3334445555',
            zipcode: '10009',
            collection_type: 'school',
            school_name: school.name,
            district_name: 'NYPS',
            school_premium_count_estimate: 1,
            teacher_premium_count_estimate: 20,
            student_premium_count_estimate: 400,
            submission_type: 'renewal request',
            comment: ''
          }
        }
      end.to change(SalesFormSubmission, :count).by(1)
      expect(response).to have_http_status(:no_content)
    end
  end

  describe '#request_renewal' do
    it 'should set type variable to "renewal request"' do
      get :request_renewal
      expect(assigns(:type)).to eq(SalesFormSubmissionController::RENEWAL_REQUEST)
    end
  end

  describe '#request_quote' do
    it 'should set type variable to "request quote"' do
      get :request_quote
      expect(assigns(:type)).to eq(SalesFormSubmissionController::QUOTE_REQUEST)
    end
  end

  describe '#options_for_sales_form' do
    let!(:first_school) { create(:school) }
    let!(:second_school) { create(:school) }
    let!(:third_school) { create(:school) }
    let!(:fourth_school) { create(:school, name: '') }

    it 'should return list of schools for type school with entries containing blank name properties filtered out' do
      get :options_for_sales_form, params: { type: SalesFormSubmissionController::SCHOOL }
      school_options = SalesFormSubmissionController::SCHOOL.classify.constantize.all.where.not(name: [nil, '']).pluck(:name)
      expect(response.body).to eq({ options: school_options }.to_json)
    end

    it 'should return list of districts for type district' do
      get :options_for_sales_form, params: { type: SalesFormSubmissionController::DISTRICT }
      district_options = SalesFormSubmissionController::DISTRICT.classify.constantize.all.pluck(:name)
      expect(response.body).to eq({ options: district_options }.to_json)
    end
  end
end
