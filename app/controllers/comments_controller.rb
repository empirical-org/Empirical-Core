class ActionController::Responder
  def to_html
    default_render
  rescue ActionView::MissingTemplate => e
    navigation_behavior(e)
  end

  def api_behavior error
    raise error unless resourceful?

    if get?
      display resource
    elsif post?
      display resource, status: :created
    elsif put?
      display resource, status: :ok
    else
      head :no_content
    end
  end
end

class CommentsController < ApplicationController
  respond_to :json
  before_filter :signed_in!
  before_filter :setup

  def index
    @comments = @lecture_chapter.comments.arrange
    respond_with Comment.json_tree(@comments)
  end

  def create
    params[:comment].delete(:parent_id) if params[:comment][:parent_id] == '0'
    @comment = current_user.comments.create(params[:comment])
    @comment.lecture_chapter_id = params[:chapter_id]
    respond_with @comment
  end

  private

  def setup
    @lecture_chapter = CMS::LectureChapter.find(params[:chapter_id])
  end
end
