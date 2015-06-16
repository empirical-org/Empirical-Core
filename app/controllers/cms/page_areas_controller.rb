class CMS::PageAreasController < CMS::BaseController
  layout 'old'  
  helper_method :subject

  protected

  def subject
    CMS::PageArea
  end
end
