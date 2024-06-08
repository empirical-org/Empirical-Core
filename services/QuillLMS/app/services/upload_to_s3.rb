# frozen_string_literal: true

class UploadToS3 < ApplicationService
  class CloudUploadError < StandardError; end

  attr_reader :payload, :user

  TEMPFILE_NAME = 'temp.csv'

  def initialize(user, payload)
    @user = user
    @payload = payload
  end

  def run
    local_tempfile << payload

    upload_csv
  end

  private def local_tempfile = @csv_tempfile ||= Tempfile.new(TEMPFILE_NAME)
  private def uploader = @uploader ||= AdminReportCsvUploader.new(admin_id: user.id)

  private def upload_csv
    # store! returns nil on failure, rather than raising an exception.
    # We address this gotcha by manually raising an exception.
    upload_status = uploader.store!(local_tempfile)
    raise CloudUploadError, "Unable to upload CSV for user #{user.id}" unless upload_status

    # The response-content-disposition param triggers browser file download instead of screen rendering
    uploader.url(query: {"response-content-disposition" => "attachment;"})
  end
end
