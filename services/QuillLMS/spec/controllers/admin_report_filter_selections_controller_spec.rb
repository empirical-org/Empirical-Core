# frozen_string_literal: true

require 'rails_helper'

describe AdminReportFilterSelectionsController, type: :controller do
  let(:user) { create(:user) }

  before do
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe "POST #show" do
    let(:admin_report_filter_selection) { create(:admin_report_filter_selection, user: user) }

    it "returns http success" do
      post :show, params: { report: admin_report_filter_selection.report }
      expect(response).to have_http_status(:success)
    end

    it "returns the correct admin report filter selection" do
      post :show, params: { report: admin_report_filter_selection.report }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body['id']).to eq(admin_report_filter_selection.id)
    end

    context "when no record is found" do
      it "returns a null record" do
        post :show, params: { report: 'non_existent_report' }
        parsed_body = JSON.parse(response.body)
        expect(parsed_body).to eq(nil)
      end
    end
  end

  describe "POST #create_or_update" do
    context "with valid params" do
      let(:report) { AdminReportFilterSelection::REPORTS.sample }
      let(:filter_selections) { 'some_selections' }
      let(:valid_attributes) { { report: report, filter_selections: filter_selections } }

      it "updates the admin report filter selection if it exists" do
        existing_record = create(:admin_report_filter_selection, user: user, report: report)
        post :create_or_update, params: valid_attributes
        existing_record.reload
        expect(existing_record.filter_selections).to eq(filter_selections)
      end

      it "creates a new admin report filter selection if it does not exist" do
        expect {
          post :create_or_update, params: valid_attributes
        }.to change(AdminReportFilterSelection, :count).by(1)
      end

      it "returns http success" do
        post :create_or_update, params: valid_attributes
        expect(response).to have_http_status(:success)
      end
    end

    context "with invalid params" do
      let(:invalid_attributes) { { report: nil } }

      it "returns http unprocessable entity" do
        post :create_or_update, params: invalid_attributes
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
