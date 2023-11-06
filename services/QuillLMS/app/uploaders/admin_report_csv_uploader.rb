# frozen_string_literal: true

class AdminReportCsvUploader < CarrierWave::Uploader::Base
  attr_reader :admin_id

  # Max value is 604800, 7 days
  # See: https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-query-string-auth.html
  FILE_EXPIRATION = 604800

  fog_directory ENV.fetch('ADMIN_REPORT_FOG_DIRECTORY', 'admin-report-fog-directory-staging')
  fog_authenticated_url_expiration FILE_EXPIRATION

  FILENAME_PREFIX = 'ADMIN_REPORT_'

  def initialize(model = nil, mounted_as = nil, admin_id:)
    @admin_id = admin_id
    super(model, mounted_as)
  end

  def fog_public
    false
  end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.

  def filename
    # See: http://stackoverflow.com/questions/6920926/carrierwave-create-the-same-unique-filename-for-all-versioned-files
    random_token = Digest::SHA2.hexdigest("#{Time.current.utc}--#{admin_id}").first(6)
    date = Date.current.strftime("%m-%d-%y")
    "#{FILENAME_PREFIX}#{admin_id}_#{date}_#{random_token}.csv"
  end
end
