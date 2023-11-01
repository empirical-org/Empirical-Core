# frozen_string_literal: true

module Snapshots
  class PremiumDownloadReportsWorker
    include Sidekiq::Worker

    class CloudUploadError < StandardError; end

    QUERIES = {
      'create_csv_report_download' => Snapshots::UntruncatedDataExportQuery
    }
    TEMPFILE_NAME = 'temp.csv'

    def perform(query, user_id, timeframe, school_ids, headers_to_display, filters)
      payload = generate_payload(query, timeframe, school_ids, filters)
      uploader = AdminReportCsvUploader.new(admin_id: user_id)
      user = User.find(user_id)

      csv_tempfile = Tempfile.new(TEMPFILE_NAME)
      csv_tempfile << Adapters::Csv::AdminPremiumDataExport.to_csv_string(payload, headers_to_display)

      # store! returns nil on failure, rather than raising an exception.
      # We address this gotcha by manually raising an exception.
      upload_status = uploader.store!(csv_tempfile)
      raise CloudUploadError, "Unable to upload CSV for user #{user_id}" unless upload_status

      uploaded_file_url = uploader.url

      email = ENV.fetch('TEST_EMAIL_ADDRESS', user.email) # TODO: remove after integration testing
      PremiumHubUserMailer.admin_premium_download_report_email(user.first_name, uploaded_file_url, email).deliver_now!
    end

    private def generate_payload(query, timeframe, school_ids, filters)
      timeframe_start = parse_datetime_string(timeframe['timeframe_start'])
      timeframe_end = parse_datetime_string(timeframe['timeframe_end'])
      filters_symbolized = filters.symbolize_keys

      QUERIES[query].run(**{
        timeframe_start:,
        timeframe_end:,
        school_ids:
      }.merge(filters_symbolized))
    end

    private def parse_datetime_string(value)
      return nil if value.nil?

      DateTime.parse(value)
    end

  end
end
