class CMS::ChapterGroupsController < CMS::BaseController
  helper_method :subject

  protected

  def subject
    CMS::ChapterGroup
  end
end
