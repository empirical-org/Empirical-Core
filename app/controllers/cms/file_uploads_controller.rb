class CMS::FileUploadsController < CMS::BaseController
  helper_method :subject

  protected

  def subject
    CMS::FileUpload
  end
end
