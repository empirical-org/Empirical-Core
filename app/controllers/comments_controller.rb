class CommentsController < ApplicationController
  respond_to :json
  before_filter :signed_in?

  def index
    @comments = Comment.arrange
    respond_with Comment.json_tree(@comments)
  end

  def create
    params[:comment].delete(:parent_id) if params[:comment][:parent_id] == '0'
    respond_with current_user.comments.create(params[:comment])
  end
end
