class CsvExportMailer < ActionMailer::Base
  default from: 'hello@quill.org'

  def csv_download(csv_export)
    @download_url = csv_export.csv_file.url
    mail to: csv_export.teacher.email, subject: 'Quill.org Teacher CSV Export'
  end
end