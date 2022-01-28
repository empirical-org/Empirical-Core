# frozen_string_literal: true

class CsvExportWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(csv_export_id, current_user_id)
    csv_export = CsvExport.find(csv_export_id)
    return if csv_export.sent?

    csv_export.export!
    csv_export.csv_file.url
    PusherCSVExportCompleted.run(current_user_id, csv_export.csv_file.url)
    csv_export.mark_sent!
  end
end
