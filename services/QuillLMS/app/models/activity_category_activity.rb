class ActivityCategoryActivity < ActiveRecord::Base
  belongs_to :activity_category
  belongs_to :activity

  after_commit :clear_activity_search_cache
  
  validates :activity_category, uniqueness: { scope: :activity }

  def clear_activity_search_cache
    Activity.clear_activity_search_cache
  end
end
