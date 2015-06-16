class CMS::FileUploadsController < CMS::BaseController
  layout 'old'
  helper_method :subject

  protected

  def subject
    CMS::FileUpload
  end
end
