namespace :blog_posts do
  desc 'Bulk clean up Blog Post data'
  task :secure_assets => :environment do
    BlogPost.all.each do |post|
      post.image_link = post.image_link.gsub(/^http:/, "https:") if post.image_link
      post.preview_card_content = post.preview_card_content.gsub("http:", "https:") if post.preview_card_content
      post.save
    end
  end
end
