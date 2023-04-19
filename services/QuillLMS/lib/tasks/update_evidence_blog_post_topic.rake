# frozen_string_literal: true

namespace :update_evidence_blog_post_topic do
  desc 'update Evidence blog post topic with new slug'
  task :run => :environment do
    BlogPost.all.each do |blog_post|
      if blog_post.topic == "Using quill for reading comprehension"
        blog_post.topic = BlogPost::WRITING_FOR_LEARNING
        blog_post.save!
      end
    end
  end
end
