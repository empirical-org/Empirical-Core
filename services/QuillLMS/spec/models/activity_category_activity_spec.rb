require 'rails_helper'

RSpec.describe ActivityCategoryActivity, type: :model do
  it { should validate_uniqueness_of(:activity_category_id).scoped_to(:activity_id) }
end
