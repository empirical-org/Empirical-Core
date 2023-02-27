# frozen_string_literal: true

# == Schema Information
#
# Table name: blog_posts
#
#  id                    :integer          not null, primary key
#  body                  :text             not null
#  center_images         :boolean
#  draft                 :boolean          default(TRUE)
#  external_link         :string
#  featured_order_number :integer
#  image_link            :string
#  order_number          :integer
#  premium               :boolean          default(FALSE)
#  press_name            :string
#  preview_card_content  :text             not null
#  published_at          :datetime
#  read_count            :integer          default(0), not null
#  slug                  :string
#  subtitle              :text
#  title                 :string           not null
#  topic                 :string
#  tsv                   :tsvector
#  created_at            :datetime
#  updated_at            :datetime
#  author_id             :integer
#
# Indexes
#
#  index_blog_posts_on_author_id   (author_id)
#  index_blog_posts_on_read_count  (read_count)
#  index_blog_posts_on_slug        (slug) UNIQUE
#  index_blog_posts_on_title       (title)
#  index_blog_posts_on_topic       (topic)
#  tsv_idx                         (tsv) USING gin
#
require 'rails_helper'

describe BlogPost, type: :model do
  let(:blog_post) { create(:blog_post) }

  describe '#increment_read_count' do
    it 'should increment the view count by 1' do
      previous_read_count = blog_post.read_count
      blog_post.increment_read_count
      expect(blog_post.reload.read_count).to eq(previous_read_count + 1)
    end
  end

  describe '#path' do
    it 'should return the slug prefixed by the teacher resources path' do
      expect(blog_post.path).to eq("/teacher-center/#{blog_post.slug}")
    end
  end

  describe '#topic_path' do
    it 'should return the path of the associated topic' do
      expect(blog_post.topic_path).to eq("/teacher-center/topic/#{blog_post.topic_slug}")
    end
  end

  describe '#topic_slug' do
    it 'should return the slug of the associated topic' do
      # The blog_post factory will assign a random valid topic, but many of them
      # don't have spaces, so their slugs are just a an instance of downcasing.
      # We want to guarantee that we're testing the space replacement functionality.
      blog_post.topic = BlogPost::WRITING_INSTRUCTION_RESEARCH
      expect(blog_post.topic_slug).to eq(blog_post.topic.downcase.gsub(' ', '-'))
    end
  end

  describe '#generate_slug' do
    let(:title) { blog_post.title }
    let(:slug) { title.gsub(/[^a-zA-Z\d\s]/, '').gsub(' ', '-').downcase }
    let(:blog_post_with_same_title) { create(:blog_post, title: title) }
    let(:another_blog_post_with_same_title) { create(:blog_post, title: blog_post_with_same_title.title) }

    it 'should generate an appropriately formatted slug' do
      expect(blog_post.slug).to eq(slug)
    end

    it 'should add append a number if the slug already exists' do
      expect(blog_post_with_same_title.slug).to eq("#{slug}-2")
    end

    it 'should increment the appended number of the slug that already exists' do
      expect(another_blog_post_with_same_title.slug).to eq("#{slug}-3")
    end
  end

  describe '#can_be_accessed_by' do
    context 'when the article is free' do
      let(:free_article) { create(:blog_post) }

      it 'should be accessible' do
        expect(free_article.can_be_accessed_by(nil)).to be(true)
      end
    end

    context 'when the article is premium' do
      let(:paid_article) { create(:blog_post, :premium) }
      let(:free_user)    { create(:teacher) }
      let(:premium_user) { create(:teacher, :premium)}

      it 'should be accessible to premium users' do
        expect(paid_article.can_be_accessed_by(premium_user)).to be(true)
      end

      it 'should not be accessible to nonpremium users' do
        expect(paid_article.can_be_accessed_by(free_user)).to be(false)
      end

      it 'should not be accessible to nonusers' do
        expect(paid_article.can_be_accessed_by(nil)).to be(false)
      end
    end
  end

  describe '#average_rating' do
    let(:blog_post) { create(:blog_post) }
    let(:blog_post_ratings) { create_list(:blog_post_user_rating, 3, blog_post: blog_post) }

    it 'should calculate the average' do
      expected_average = (blog_post_ratings.map(&:rating).sum / blog_post_ratings.size).round(2)
      expect(blog_post.average_rating).to eq(expected_average)
    end

    it 'should return nil if there are no ratings' do
      expect(blog_post.average_rating).to be(nil)
    end
  end

  describe '#self.related_posts' do
    let(:blog_post1) { create(:blog_post, topic: "What's new") }
    let(:blog_post2) { create(:blog_post, topic: "What's new", created_at: 1.day.ago) }
    let(:blog_post3) { create(:blog_post, topic: "Getting started") }
    let(:blog_post4) { create(:blog_post, topic: "What's new", created_at: 1.year.ago) }
    let(:blog_post5) { create(:blog_post, topic: "What's new", created_at: 1.week.ago) }

    subject { described_class.related_posts(blog_post1) }

    it 'should fetch posts of the same topic sorted by most recent' do
      expect(subject.all).to eq([blog_post2, blog_post5, blog_post4])
    end
  end
end
