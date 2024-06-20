# frozen_string_literal: true

module Snapshots
  class PremiumDownloadReportsWorker
    include Sidekiq::Worker

    class CloudUploadError < StandardError; end

    QUERIES = ::Snapshots::PREMIUM_DOWNLOAD_REPORTS_QUERY_MAPPING

    def perform(query, user_id, timeframe, school_ids, headers_to_display, filters)
      user = User.find(user_id)
      payload = generate_payload(query, timeframe, school_ids, user, filters)

      data = PremiumDataCsvGenerator.run(payload, specified_columns: headers_to_display)

      uploaded_file_url = UploadToS3.run(user, data, UploadToS3::CSV_FORMAT)

      email = ENV.fetch('TEST_EMAIL_ADDRESS', user.email) # TODO: remove after integration testing
      PremiumHubUserMailer.admin_premium_download_report_email(user.first_name, uploaded_file_url, email).deliver_now!
    end

    private def generate_payload(query, timeframe, school_ids, user, filters)
      timeframe_start = parse_datetime_string(timeframe['timeframe_start'])
      timeframe_end = parse_datetime_string(timeframe['timeframe_end'])
      filters_symbolized = filters.symbolize_keys

      QUERIES[query].run(**{
        timeframe_start:,
        timeframe_end:,
        school_ids:,
        user:
      }.merge(filters_symbolized))
    end

    private def parse_datetime_string(value)
      return nil if value.nil?

      DateTime.parse(value)
    end

  end
end
