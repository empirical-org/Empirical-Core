class Cms::AuthorsController < ApplicationController
  before_filter :admin!
  before_action :set_author, only: [:update, :destroy]

  def index
    respond_to do |format|
      format.html
      format.json do
        render json: Author.all.map{|a| AuthorSerializer.new(a).as_json(root: false)}
      end
    end
  end

  def create
    @author = Author.new(author_params)
    if @author.save
      render json: @author
    else
      render json: @author.errors, status: 422
    end
  end

  def update
    @author.assign_attributes(author_params)
    if @author.save
      render json: @author
    else
      render json: @author.errors, status: 422
    end
  end

  def destroy
    @author.destroy
    render json: {}
  end

  private

  def set_author
    @author = Author.find(params[:id])
  end

  def author_params
    params.require(:author).permit(:id, :name, :avatar)
  end
end