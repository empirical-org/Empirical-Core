# frozen_string_literal: true

require 'rails_helper'

describe AdminReportFilterSelectionsController, type: :controller do
  let(:user) { create(:user) }
  let(:valid_attributes) { { report: AdminReportFilterSelection::DATA_EXPORT, user_id: user.id } }
  let(:invalid_attributes) { { report: 'invalid_report', user_id: user.id } }

  before do
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe "POST #show" do
    context "with valid params" do

      it "returns the requested admin report filter selection" do
        admin_report_filter_selection = create(:admin_report_filter_selection, valid_attributes)

        post :show, params: { admin_report_filter_selection: { report: admin_report_filter_selection.report } }
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['report']).to eq(admin_report_filter_selection.report)
      end
    end

    context "with invalid params" do
      it "returns null" do
        post :show, params: { admin_report_filter_selection: invalid_attributes }
        expect(JSON.parse(response.body)).to eq(nil)
      end
    end
  end

  describe "POST #create_or_update" do
    context "with valid params" do
      it "creates a new AdminReportFilterSelection" do
        expect {
          post :create_or_update, params: { admin_report_filter_selection: valid_attributes }
        }.to change(AdminReportFilterSelection, :count).by(1)
      end

      it "updates the filter selections" do
        report = AdminReportFilterSelection::USAGE_SNAPSHOT_REPORT
        admin_report_filter_selection = create(:admin_report_filter_selection, user: user, report: report, filter_selections: { 'timeframe' => { 'value' => 'last_week' } })

        timeframe = { 'value' => 'last_month', 'name' => 'Last Month' }
        school ={ 'id' => 1, 'name' => 'School 1' }

        updated_filter_selections = {
          'timeframe' => timeframe,
          'schools' => [school]
        }
        updated_attributes = { report: report, filter_selections: updated_filter_selections }

        post :create_or_update, params: { admin_report_filter_selection: updated_attributes }
        admin_report_filter_selection.reload

        expect(admin_report_filter_selection.filter_selections['timeframe']['value']).to eq(timeframe['value'])
        expect(admin_report_filter_selection.filter_selections['schools'][0]['name']).to eq(school['name'])
      end

      it "renders a JSON response with the admin report filter selection" do
        post :create_or_update, params: { admin_report_filter_selection: valid_attributes }
        expect(response).to have_http_status(:ok)
      end
    end

    context "with invalid params" do
      it "renders a JSON response with errors for the new admin report filter selection" do
        post :create_or_update, params: { admin_report_filter_selection: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
