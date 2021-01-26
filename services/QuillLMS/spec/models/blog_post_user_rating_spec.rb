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
require 'rails_helper'

RSpec.describe BlogPostUserRating, type: :model do
  describe 'ACCEPTABLE_RATINGS' do
    it 'should be from 0 to 2' do
      expect(BlogPostUserRating::ACCEPTABLE_RATINGS).to eq([0, 1, 2])
    end
  end
end
