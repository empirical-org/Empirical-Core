# frozen_string_literal: true

class AdminReportFilterSelectionsController < ApplicationController
  def show
    admin_report_filter_selection = AdminReportFilterSelection.find_by(report:, user_id:)
    render json: admin_report_filter_selection
  end

  def create_or_update
    admin_report_filter_selection = AdminReportFilterSelection.find_or_initialize_by(report:, user_id:)

    if admin_report_filter_selection.update(admin_report_filter_selection_params)
      render json: admin_report_filter_selection, status: :ok
    else
      render json: admin_report_filter_selection.errors, status: :unprocessable_entity
    end
  end

  private def admin_report_filter_selection_params
    params
      .require(:admin_report_filter_selection)
      .permit(
        :report,
        filter_selections: [
          :custom_start_date,
          :custom_end_date,
          timeframe: [:value, :name, :default, :label],
          schools: [:id, :name, :label, :value],
          teachers: [:id, :name, :label, :value],
          classrooms: [:id, :name, :label, :value],
          grades: [:value, :name, :label],
          group_by_value: [:label, :value],
          diagnostic_type_value: [:label, :value]
        ]
      )
  end

  private def report = admin_report_filter_selection_params[:report]
  private def user_id = current_user.id
end
