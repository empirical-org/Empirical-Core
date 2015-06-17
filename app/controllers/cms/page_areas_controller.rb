class CMS::PageAreasController < CMS::BaseController
  layout 'scorebook'  
  helper_method :subject

  protected

  def subject
    CMS::PageArea
  end
end
