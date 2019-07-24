require 'rails_helper'

RSpec.describe BlogPostUserRating, type: :model do
  describe 'ACCEPTABLE_RATINGS' do
    it 'should be from 0 to 2' do
      expect(BlogPostUserRating::ACCEPTABLE_RATINGS).to eq([0, 1, 2])
    end
  end
end
