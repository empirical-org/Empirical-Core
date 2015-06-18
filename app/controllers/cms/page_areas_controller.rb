class CMS::PageAreasController < CMS::BaseController
  helper_method :subject

  protected

  def subject
    CMS::PageArea
  end
end
