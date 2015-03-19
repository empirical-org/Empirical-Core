class CsvExportWorker
  include Sidekiq::Worker

  def perform(csv_export_id)
    csv_export = CsvExport.find(csv_export_id)
    return if csv_export.sent?
    csv_export.export!
    CsvExportMailer.csv_download(csv_export).deliver
    csv_export.mark_sent!
  end
end