class CsvExportWorker
  include Sidekiq::Worker

  def perform(csv_export_id, current_user_id)
    csv_export = CsvExport.find(csv_export_id)
    return if csv_export.sent?
    csv_export.export!
    csv_export.csv_file.url
    PusherCSVExportCompleted.run(current_user_id, csv_export.csv_file.url)
    # LOOK HERE RYAN
    # CsvExportMailer.csv_download(csv_export).deliver_now
    csv_export.mark_sent!
  end
end
