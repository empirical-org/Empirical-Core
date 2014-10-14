class CMS::HomepageNewsSlide < ActiveRecord::Base
  self.table_name = 'homepage_news_slides'

  include RankedModel

  ranks :position

  mount_uploader :image, CMS::Uploader

  belongs_to :author, class_name: 'User'

  def self.name
    'HomepageNewsSlide'
  end
end
