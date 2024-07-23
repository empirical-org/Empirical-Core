# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AdminReportFilterSelectionsController, type: :controller do
  let(:user) { create(:user) }

  let(:valid_params) do
    {
      filter_selections: {
        classrooms: nil,
        custom_end_date: nil,
        custom_start_date: nil,
        grades: [],
        schools: [],
        teachers: [],
        timeframe: {},
        group_by_value: {},
        diagnostic_type_value: {}
      },
      report: AdminReportFilterSelection::DATA_EXPORT,
      user_id: user.id
    }
  end

  let(:invalid_params) { { report: 'invalid_report' } }
  let(:valid_model_attributes) { valid_params.merge({ user_id: user.id }) }

  before do
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe 'POST #show' do
    context 'with valid params' do
      it 'returns the requested admin report filter selection' do
        admin_report_filter_selection = create(:admin_report_filter_selection, valid_model_attributes)

        post :show, params: { admin_report_filter_selection: { report: admin_report_filter_selection.report } }
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['report']).to eq(admin_report_filter_selection.report)
      end
    end

    context 'with invalid params' do
      it 'returns null' do
        post :show, params: { admin_report_filter_selection: invalid_params }
        expect(JSON.parse(response.body)).to eq(nil)
      end
    end
  end

  describe 'POST #create_or_update' do
    context 'with valid params' do
      it 'creates a new AdminReportFilterSelection' do
        expect {
          post :create_or_update, params: { admin_report_filter_selection: valid_params }
        }.to change(AdminReportFilterSelection, :count).by(1)
      end

      it 'updates the filter selections for standard filters' do
        report = AdminReportFilterSelection::USAGE_SNAPSHOT_REPORT
        last_week = 'last_week'
        admin_report_filter_selection = create(:admin_report_filter_selection, user: user, report: report, filter_selections: { 'timeframe' => { 'value' => last_week }, 'schools' => [{}] })

        timeframe = { 'value' => 'last_month', 'name' => 'Last Month' }
        school = { 'id' => 1, 'name' => 'School 1' }

        updated_filter_selections = {
          'timeframe' => timeframe,
          'schools' => [school]
        }
        updated_attributes = { report: report, filter_selections: updated_filter_selections }

        expect do
          post :create_or_update, params: { admin_report_filter_selection: updated_attributes }
        end.to change { admin_report_filter_selection.reload.filter_selections['timeframe']['value'] }.from(last_week).to(timeframe['value'])
          .and change { admin_report_filter_selection.reload.filter_selections['schools'][0]['name'] }.from(nil).to(school['name'])
      end

      it 'updates the filter selections for growth diagnostic dropdown filters' do
        report = AdminReportFilterSelection::DIAGNOSTIC_GROWTH_REPORT_SKILL
        grade_string = 'grade'
        classroom_string = 'classroom'
        first_diagnostic_id = '1663'
        second_diagnostic_id = '1161'
        grade_option = { 'value' => grade_string, 'label' => grade_string }
        classroom_option = { 'value' => classroom_string, 'label' => classroom_string }
        starter_diagnostic_option = { 'value' => first_diagnostic_id, 'label' => 'Starter Diagnostic' }
        ell_starter_diagnostic_option = { 'value' => second_diagnostic_id, 'label' => 'ELL Starter Diagnostic' }

        admin_report_filter_selection = create(:admin_report_filter_selection, user: user, report: report, filter_selections: { 'group_by_value' => grade_option, 'diagnostic_type_value' => starter_diagnostic_option })

        updated_filter_selections = {
          'group_by_value' => classroom_option,
          'diagnostic_type_value' => ell_starter_diagnostic_option
        }
        updated_attributes = { report: report, filter_selections: updated_filter_selections }

        expect do
          post :create_or_update, params: { admin_report_filter_selection: updated_attributes }
        end.to change { admin_report_filter_selection.reload.filter_selections['group_by_value']['value'] }.from(grade_string).to(classroom_string)
          .and change { admin_report_filter_selection.reload.filter_selections['diagnostic_type_value']['value'] }.from(first_diagnostic_id).to(second_diagnostic_id)
      end

      it 'renders a JSON response with the admin report filter selection' do
        post :create_or_update, params: { admin_report_filter_selection: valid_params }
        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid params' do
      it 'renders a JSON response with errors for the new admin report filter selection' do
        post :create_or_update, params: { admin_report_filter_selection: invalid_params }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
