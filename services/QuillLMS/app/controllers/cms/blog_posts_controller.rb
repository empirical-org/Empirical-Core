# frozen_string_literal: true

class Cms::BlogPostsController < Cms::CmsController
  around_action :force_writer_db_role, only: [:destroy, :unpublish]

  before_action :set_blog_post, only: [:update, :destroy, :edit, :show, :unpublish]
  before_action :authors, :topics, only: [:index, :edit, :new]

  def index
    @blog_posts_name_and_id = BlogPost.all.map{|bp| bp.attributes.merge({'rating' => bp.average_rating})}
    #cms/blog_posts/index.html.erb
  end

  def new
    #cms/blog_posts/new.html.erb
  end

  def edit
    #cms/blog_posts/edit.html.erb
  end

  def create
    blog_post = BlogPost.create(blog_post_params)
    render json: blog_post
  end

  def update
    @blog_post.update(blog_post_params)
    render json: @blog_post
  end

  def destroy
    @blog_post.destroy
    redirect_to cms_blog_posts_path
  end

  def unpublish
    @blog_post.update(draft: true)
    flash[:success] = 'Blog post successfully set to draft.'
    redirect_to cms_blog_posts_path
  end

  def update_order_numbers
    JSON.parse(params[:blog_posts]).each { |bp| BlogPost.find(bp['id']).update(order_number: bp['order_number'])}
    render json: {}
  end

  def update_featured_order_numbers
    JSON.parse(params[:blog_posts]).each { |bp| BlogPost.find(bp['id']).update(featured_order_number: bp['featured_order_number'])}
    render json: {}
  end

  private def authors
    @authors = Author.all.select('name', 'id')
  end

  private def blog_post_params
    params.require(:blog_post)
            .permit(:id,
                    :body,
                    :title,
                    :subtitle,
                    :author_id,
                    :topic,
                    :read_count,
                    :preview_card_content,
                    :draft,
                    :premium,
                    :external_link,
                    :published_at,
                    :center_images,
                    :image_link,
                    :press_name,
                    :featured_order_number
                  )
  end

  private def set_blog_post
    @blog_post = BlogPost.find(params[:id])
  end

  private def topics
    @topics = BlogPost::TOPICS
    @student_topics = BlogPost::STUDENT_TOPICS
  end
end
