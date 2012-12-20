class CMS::LectureChaptersController < CMS::BaseController
  helper_method :subject

  def index
    @records = if params[:search].blank?
      subject.unscoped.order('lecture_id asc, position asc')        .page(params[:page]).per(100)
    else
      subject.search(params[:search]).page(params[:page]).per(100)
    end

    set_collection_variable
    respond_with(@records)
  end

  protected

  def subject
    CMS::LectureChapter
  end
end
