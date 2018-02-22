class BlogPostUserRating < ActiveRecord::Base
  ACCEPTABLE_RATINGS = [0, 1, 2]
end
