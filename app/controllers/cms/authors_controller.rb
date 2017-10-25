class Cms::AuthorsController < ApplicationController
  before_filter :staff!

  def index
    @authors = Author.all
  end

  def new
    @author = Author.new
  end

  def create
    @author = Author.new(author_params)
    if @author.save
      flash[:success] = 'Created successfully!'
      redirect_to cms_authors_path
    else
      flash[:error] = 'Something went wrong.'
      render :new
    end
  end

  def edit
    @author = Author.find(params[:id])
  end

  def update
    author = Author.find(params[:id])
    author.assign_attributes(author_params)
    if author.save
      flash[:success] = 'Updated successfully!'
      redirect_to cms_authors_path
    else
      flash[:error] = 'Something went wrong.'
      render :update
    end
  end

  private
  def author_params
    params.require(:author).permit(:id, :name, :avatar, default_params)
  end
end
