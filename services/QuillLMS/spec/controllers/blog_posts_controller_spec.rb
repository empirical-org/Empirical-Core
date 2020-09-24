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
    let(:three_most_recent_posts) { create_list(:blog_post, 3) }

    it 'should return a 404 if no such post found' do
      expect { get :show, slug: 'does-not-exist' }.to raise_error ActiveRecord::RecordNotFound
    end

    it 'should return the called blog post' do
      get :show, slug: blog_post.slug
      expect(assigns(:blog_post)).to eq(blog_post)
    end

    it 'should increment the blog post read count' do
      expect { get :show, slug: blog_post.slug }.to change { blog_post.reload.read_count }.by(1)
    end

    it 'should return the blog post author' do
      get :show, slug: blog_post.slug
      expect(assigns(:author)).to eq(blog_post.author)
    end

    it 'should return the three most recent posts' do
      get :show, slug: blog_post.slug
      expect(assigns(:most_recent_posts)).to match_array(three_most_recent_posts)
    end

    it 'should return the title' do
      get :show, slug: blog_post.slug
      expect(assigns(:title)).to eq(blog_post.title)
    end

    it 'should return the description' do
      get :show, slug: blog_post.slug
      expect(assigns(:description)).to eq(blog_post.subtitle)
    end

    it 'should return the title as description if no subtitle exists' do
      blog_post = create(:blog_post, subtitle: nil)
      get :show, slug: blog_post.slug
      expect(assigns(:description)).to eq(blog_post.title)
    end
  end

  describe '#show_topic' do
    let(:topic) { BlogPost::TEACHER_TOPICS.sample }
    let(:blog_posts) { create_list(:blog_post, 3, topic: topic) }
    let(:draft_post) { create(:blog_post, :draft, topic: topic) }

    it 'should return a 404 if topic slug is not found' do
      expect { get :show_topic, topic: 'does-not-exist' }.to raise_error ActionController::RoutingError
    end

    it 'should never return a draft' do
      draft_post
      get :show_topic, topic: topic.downcase.gsub(' ','-')
      expect(assigns(:blog_posts)).not_to include(draft_post)
    end

    it 'should return all the posts associated with this topic' do
      blog_posts
      get :show_topic, topic: topic.downcase.gsub(' ','-')
      expect(assigns(:blog_posts)).to match_array(blog_posts)
    end

    it 'should return a title' do
      get :show_topic, topic: topic.downcase.gsub(' ','-')
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
      get :search, query: query
      expect(assigns(:title)).to eq("Search: #{query}")
    end

    it 'should not return a blog post with the topic "In the news"' do
      query = 'Press'
      get :search, query: query
      expect(assigns(:blog_posts)).to eq([])
    end

    xit 'should return posts that match the query' do
      # TODO: figure out how to test this effectively and consistently
      blog_posts
      get :search, query: BlogPost.second.tsv.split(' ').first.gsub("'",'').gsub(/:.*$/,'')
      expect(assigns(:blog_posts)).to eq([{
        'slug' => BlogPost.second.slug,
        'preview_card_content' => BlogPost.second.preview_card_content
      }])
    end
  end
end
