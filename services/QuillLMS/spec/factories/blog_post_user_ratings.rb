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
FactoryBot.define do
  factory :blog_post_user_rating do
    user      { create(:user) }
    blog_post { create(:blog_post) }
    rating    { BlogPostUserRating::ACCEPTABLE_RATINGS.sample }
  end
end
