class CMS::LecturesController < CMS::BaseController
  helper_method :subject

  protected

  def subject
    CMS::Lecture
  end
end
