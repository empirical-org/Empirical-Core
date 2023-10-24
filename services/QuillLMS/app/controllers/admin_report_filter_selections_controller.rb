# frozen_string_literal: true

class AdminReportFilterSelectionsController < ApplicationController

  def show
    admin_report_filter_selection = AdminReportFilterSelection.find_by(
      report: admin_report_filter_selection_params[:report],
      user_id: current_user.id
    )

    render json: admin_report_filter_selection
  end

  def create_or_update
    admin_report_filter_selection = AdminReportFilterSelection.find_or_initialize_by(
      report: admin_report_filter_selection_params[:report],
      user_id: current_user.id
    )

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
          timeframe: [:value, :name, :default, :label],
          schools: [:id, :name, :label, :value],
          teachers: [:id, :name, :label, :value],
          classrooms: [:id, :name, :label, :value],
          grades: [:value, :name, :label]
        ]
      )
  end
end
