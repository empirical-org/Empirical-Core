class CMS::TopicCategoriesController < ApplicationController
  before_action :set_topic_category, only: [:show, :edit, :update, :destroy]

  def index
    @topic_categories = TopicCategory.all
  end

  def show
  end

  def new
  end

  def edit
  end

  def create
    TopicCategory.create(topic_category_params)
    redirect_to cms_topic_categories_url
  end

  def update
    if @topic_category.update_attributes(topic_category_params)
      redirect_to cms_topic_categories_url, notice: "Topic Category was successfully created"
    else
      render action: 'edit'
    end
  end

  def destroy
    @topic_category.destroy
    head :ok
  end

private

  def set_topic_category
    @topic_category = TopicCategory.find(params[:id])
  end

  def topic_category_params
    params.require(:topic_category).permit(:name)
  end
end