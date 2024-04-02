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
#  footer_content        :text             default("")
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
FactoryBot.define do
  factory :blog_post do
    title                { "Post Title" }
    subtitle             { "Post Subtitle" }
    body                 { "Post body." }
    topic                { BlogPost::TOPICS.sample }
    preview_card_content { "<img class='preview-card-image' src='http://placehold.it/300x135' /><div class='preview-card-body'><h3>Write Your Title Here</h3><p>Write your description here, but be careful not to make it too long!</p><p class='author'>by Quill Staff</p></div>" }
    draft                { false }

    trait :premium do
      premium { true }
    end

    trait :draft do
      draft { true }
    end

    factory :blog_post_with_author do

      after(:create) do |blog_post|
        author = create(:author)
        blog_post.author = author
        blog_post.save!
      end
    end
  end
end
