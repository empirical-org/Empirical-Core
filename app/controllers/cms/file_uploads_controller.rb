class CMS::FileUploadsController < CMS::BaseController
  layout 'scorebook'
  helper_method :subject

  protected

  def subject
    CMS::FileUpload
  end
end
