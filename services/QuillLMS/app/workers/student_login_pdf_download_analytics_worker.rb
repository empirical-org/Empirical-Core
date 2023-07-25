# frozen_string_literal: true

class StudentLoginPdfDownloadAnalyticsWorker
  include Sidekiq::Worker

  def perform(user_id, classroom_id)
    analytics = Analytics::SegmentAnalytics.new
    analytics.track_student_login_pdf_download(user_id, classroom_id)
  end
end
