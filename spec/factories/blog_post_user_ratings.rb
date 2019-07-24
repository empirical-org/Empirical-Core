FactoryBot.define do
  factory :blog_post_user_rating do
    user      { create(:user) }
    blog_post { create(:blog_post) }
    rating    { BlogPostUserRating::ACCEPTABLE_RATINGS.sample }
  end
end
