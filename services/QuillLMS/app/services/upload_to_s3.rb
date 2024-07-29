# frozen_string_literal: true

class UploadToS3 < ApplicationService
  class CloudUploadError < StandardError; end
  class UndefinedExtensionError < StandardError; end

  attr_reader :extension, :payload, :user

  TEMPFILE_NAME = 'temp'
  CSV_FORMAT = 'csv'
  # Uploaders set things like mime type and accessibility rules
  EXTENSION_UPLOADERS = {
    CSV_FORMAT => AdminReportCsvUploader
  }

  def initialize(user, payload, extension)
    @user = user
    @payload = payload
    @extension = extension
  end

  def run
    local_tempfile << payload

    upload_file
  end

  private def local_tempfile = @tempfile ||= Tempfile.new(tempfile_name)
  private def tempfile_name = "#{TEMPFILE_NAME}.#{extension}"
  private def uploader = @uploader ||= uploader_class.new(admin_id: user.id)

  private def uploader_class
    EXTENSION_UPLOADERS.fetch(extension)
  rescue KeyError
    raise UndefinedExtensionError, "'#{extension}' is not a defined extension for the uploader"
  end

  private def upload_file
    # store! returns nil on failure, rather than raising an exception.
    # We address this gotcha by manually raising an exception.
    upload_status = uploader.store!(local_tempfile)
    raise CloudUploadError, "Unable to upload #{extension} file for user #{user.id}" unless upload_status

    # The response-content-disposition param triggers browser file download instead of screen rendering
    uploader.url(query: { 'response-content-disposition' => 'attachment;' })
  end
end
