class CMS::LectureChapturesController < CMS::BaseController
  helper_method :subject

  protected

  def subject
    CMS::LectureChapture
  end
end
