# frozen_string_literal: true

require 'rails_helper'

describe BlogPostsController, type: :controller do
  it { should use_before_action :set_announcement }

  let(:announcement) { create(:announcement) }

  describe '#index' do
    let(:blog_posts) { create_list(:blog_post, 3) }
    let(:draft_post) { create(:blog_post, :draft) }

    it 'should return all non-draft blog posts where the topic is a teacher topic' do
      get :index
      teacher_blog_posts = blog_posts.select { |bp| BlogPost::TEACHER_TOPICS.include?(bp.topic) }
      expect(assigns(:blog_posts)).to match_array(teacher_blog_posts)
    end

    it 'should never return a draft' do
      get :index
      expect(assigns(:blog_posts)).not_to include(draft_post)
    end

    it 'should return the current webinar announcement' do
      announcement
      get :index
      expect(assigns(:announcement)['text']).to eq(announcement.text)
      expect(assigns(:announcement)['link']).to eq(announcement.link)
    end
  end

  describe '#show' do
    let(:blog_post) { create(:blog_post) }
    let(:blog_post2) { create(:blog_post, topic: "What's new", created_at: 1.day.ago) }
    let(:blog_post3) { create(:blog_post, topic: "Getting started") }
    let(:blog_post4) { create(:blog_post, topic: "What's new", created_at: 1.year.ago) }
    let(:blog_post5) { create(:blog_post, topic: "What's new", created_at: 1.week.ago) }
    let(:related_posts_array) { [blog_post2, blog_post5, blog_post4] }

    before do
      allow_any_instance_of(BlogPost).to receive(:related_posts).and_return(related_posts_array)
    end

    it 'should redirect to teacher center home if no such post found' do
      get :show, params: { slug: 'does-not-exist' }

      expect(response).to redirect_to blog_posts_path
      expect(flash[:error]).to include("Oops! We can't seem to find that blog post.")
    end

    it 'should return the called blog post' do
      get :show, params: { slug: blog_post.slug }
      expect(assigns(:blog_post)).to eq(blog_post)
    end

    it 'should redirect to blog post even if there are extra chars' do
      get :show, params: { slug: "#{blog_post.slug})()(" }

      expect(response).to redirect_to "/teacher-center/#{blog_post.slug}"
    end

    it 'should increment the blog post read count' do
      expect { get :show, params: { slug: blog_post.slug } }.to change { blog_post.reload.read_count }.by(1)
    end

    it 'should return the blog post author' do
      get :show, params: { slug: blog_post.slug }
      expect(assigns(:author)).to eq(blog_post.author)
    end

    it 'should return the three most recent posts' do
      get :show, params: { slug: blog_post.slug }
      expect(assigns(:related_posts)).to eq(related_posts_array)
    end

    it 'should return the title' do
      get :show, params: { slug: blog_post.slug }
      expect(assigns(:title)).to eq(blog_post.title)
    end

    it 'should return the description' do
      get :show, params: { slug: blog_post.slug }
      expect(assigns(:description)).to eq(blog_post.subtitle)
    end

    it 'should return the image link' do
      get :show, params: { slug: blog_post.slug }
      expect(assigns(:image_link)).to eq(BlogPostsController::SOCIAL_MEDIA_SHARE_IMAGE)
    end

    it 'should return the title as description if no subtitle exists' do
      blog_post = create(:blog_post, subtitle: nil)
      get :show, params: { slug: blog_post.slug }
      expect(assigns(:description)).to eq(blog_post.title)
    end

    it 'should return the title as description if the subtitle is an empty string' do
      blog_post = create(:blog_post, subtitle: "")
      get :show, params: { slug: blog_post.slug }
      expect(assigns(:description)).to eq(blog_post.title)
    end
  end

  describe '#featured_blog_post' do
    let(:blog_post) { create(:blog_post_with_author) }

    it 'should return the blog post and author with passed id param' do
      get :featured_blog_post, params: { id: blog_post.id }

      expect(JSON.parse(response.body)["blog_post"]["id"]).to eq(blog_post.id)
      expect(JSON.parse(response.body)["author"]).to eq(blog_post.author.name)
    end
  end

  describe '#show_topic' do
    let(:public_teacher_topics) { BlogPost::TEACHER_TOPICS }
    let(:topic) { public_teacher_topics.sample }
    let(:blog_posts) { create_list(:blog_post, 3, topic: topic) }
    let(:draft_post) { create(:blog_post, :draft, topic: topic) }

    it 'should redirect a legacy_url' do
      get :show_topic, params: { topic: 'param_with_underscores' }

      expect(response).to redirect_to '/teacher-center/topic/param-with-underscores'
    end

    it 'should redirect to teacher_center if topic slug is not found' do
      get :show_topic, params: { topic: 'does-not-exist' }

      expect(response).to redirect_to '/teacher-center'
    end

    it 'should redirect students to student_center if topic slug is not found' do
      allow(controller).to receive(:current_user) { create(:student) }

      get :show_topic, params: { topic: 'does-not-exist' }

      expect(response).to redirect_to '/student-center'
    end

    it 'should never return a draft' do
      draft_post
      get :show_topic, params: { topic: topic.downcase.gsub(' ','-') }
      expect(assigns(:blog_posts)).not_to include(draft_post)
    end

    it 'should return all the posts associated with this topic' do
      blog_posts
      get :show_topic, params: { topic: topic.downcase.gsub(' ','-') }
      expect(assigns(:blog_posts)).to match_array(blog_posts)
    end

    it 'should return a title' do
      get :show_topic, params: { topic: topic.downcase.gsub(' ','-') }
      expect(assigns(:title)).to eq(topic)
    end

  end

  describe '#search' do
    let(:blog_posts) { create_list(:blog_post, 3) }
    let(:in_the_news_post) { create(:blog_post, title: 'Press', topic: BlogPost::IN_THE_NEWS)}

    it 'should redirect back if no query is present' do
      request.env["HTTP_REFERER"] = 'https://example.org'
      get :search
      expect(response).to redirect_to 'https://example.org'
    end

    it 'should return the proper title' do
      query = 'example query'
      get :search, params: { query: query }
      expect(assigns(:title)).to eq("Search: #{query}")
    end

    it 'should not return a blog post with the topic "In the news"' do
      query = 'Press'
      get :search, params: { query: query }
      expect(assigns(:blog_posts)).to eq([])
    end
  end
end
