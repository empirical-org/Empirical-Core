class CMS::CoursesController < CMS::BaseController
  helper_method :subject

  protected

  def subject
    CMS::Course
  end
end
