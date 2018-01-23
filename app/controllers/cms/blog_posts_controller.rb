class Cms::BlogPostsController < ApplicationController
  before_filter :staff!

  def index
    @blog_posts_name_and_id = BlogPost.all.select('title', 'id')
  end

  def new
    @authors = authors
  end

  def edit
  end

  def create
    blog_post = BlogPost.create(blog_post_params)
    render json: blog_post
  end

  def update

  end

  def destroy

  end

  private

  def authors
    Author.all.select('name', 'id')
  end

  def blog_post_params
    params.require(:blog_post)
            .permit(:id,
                    :body,
                    :title,
                    :subtitle,
                    :author_id,
                    :topic,
                    :read_count)
  end
end
