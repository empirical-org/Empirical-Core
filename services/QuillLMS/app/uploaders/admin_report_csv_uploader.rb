# frozen_string_literal: true

class AdminReportCsvUploader < ApplicationUploader
  FILENAME_PREFIX = 'ADMIN_REPORT_'

  # See: https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-query-string-auth.html
  fog_authenticated_url_expiration 7.days.to_i
  fog_directory ADMIN_REPORT_FOG_DIRECTORY

  attr_reader :admin_id

  def initialize(model = nil, mounted_as = nil, admin_id:)
    @admin_id = admin_id
    super(model, mounted_as)
  end

  def filename
    "#{FILENAME_PREFIX}_REPORT_#{@admin_id}_#{date}_#{generate_token}.csv"
  end

  def fog_attributes
    { 'Content-Type' => 'text/csv' }
  end

  def fog_public
    false
  end

  private def token_seed
    "#{Time.current.utc}--#{@admin_id}"
  end
end
