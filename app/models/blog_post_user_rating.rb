class BlogPostUserRating < ActiveRecord::Base
  belongs_to :user
  belongs_to :blog_post

  ACCEPTABLE_RATINGS = [0, 1, 2]
end
