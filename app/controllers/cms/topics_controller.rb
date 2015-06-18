class CMS::TopicsController < ApplicationController
  before_action :set_topic, only: [:show, :edit, :update, :destroy]

  def index
    @topics = Topic.includes(:section).order('sections.name ASC')
  end

  def show
  end

  def new
    @topic = Topic.new
  end

  def edit
  end

  def create
    @topic = Topic.new(topic_params)

    if @topic.save
      redirect_to cms_topics_url, notice: 'Chapter level was successfully created.'
    else
      render action: 'new'
    end
  end

  def update
    if @topic.update(topic_params)
      redirect_to cms_topics_url, notice: 'Chapter level was successfully updated.'
    else
      render action: 'edit'
    end
  end

  def destroy
    @topic.destroy
    head :ok
  end

private

  def set_topic
    @topic = Topic.find(params[:id])
  end

  def topic_params
    params.require(:topic).permit(:name, :section_id, :topic_category_id)
  end
end