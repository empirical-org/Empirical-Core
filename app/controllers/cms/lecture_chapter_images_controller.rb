class CMS::LectureChapterImagesController < CMS::BaseController
  helper_method :subject

  protected

  def subject
    CMS::LectureChapterImage
  end
end
