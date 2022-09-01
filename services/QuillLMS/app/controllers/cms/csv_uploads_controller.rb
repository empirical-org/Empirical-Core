# frozen_string_literal: true

class Cms::CsvUploadsController < Cms::CmsController

  def create
    uploader = StaffCSVUploader.new
    uploader.store!(params[:file])

    puts (uploader.filename)
    render json: {filename: uploader.filename}
  end
end
