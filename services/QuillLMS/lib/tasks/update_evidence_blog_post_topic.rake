# frozen_string_literal: true

namespace :update_evidence_blog_post_topic do
  desc 'update Evidence blog post topic with new slug'
  task :run => :environment do
    BlogPost.where(topic: "Using quill for reading comprehension").each do |blog_post|
      blog_post.update!(topic: BlogPost::WRITING_FOR_LEARNING)
    end
  end
end
