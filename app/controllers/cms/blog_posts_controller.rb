class Cms::BlogPostsController < ApplicationController
  before_filter :staff!

  def index
    @blog_posts_name_and_id = BlogPost.all.select('title', 'id')
  end

  def create
    # attributes = unit_template_params
    #
    # attributes.delete(:authenticity_token)
    #
    # @unit_template = UnitTemplate.new(unit_template_params)
    # if @unit_template.save!
    #   render json: @unit_template
    # else
    #   render json: {errors: @unit_template.errors}, status: 422
    # end
  end

  def update

  end

  def destroy

  end

  private

end
