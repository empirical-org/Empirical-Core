module ProgressReportHelper
  def is_progress_report_page?
    controller.class.parent == Teachers::ProgressReports ||
      controller.class.parent == Teachers::ProgressReports::Standards
  end
end