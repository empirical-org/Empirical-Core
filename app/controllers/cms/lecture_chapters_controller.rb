class CMS::LectureChaptersController < CMS::BaseController
  helper_method :subject

  protected

  def subject
    CMS::LectureChapter
  end
end
