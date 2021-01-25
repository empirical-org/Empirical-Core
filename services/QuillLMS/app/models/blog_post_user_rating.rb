# == Schema Information
#
# Table name: blog_post_user_ratings
#
#  id           :integer          not null, primary key
#  rating       :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  blog_post_id :integer
#  user_id      :integer
#
class BlogPostUserRating < ActiveRecord::Base
  belongs_to :user
  belongs_to :blog_post

  ACCEPTABLE_RATINGS = [0, 1, 2]
end
