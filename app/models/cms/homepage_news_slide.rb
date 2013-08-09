class CMS::HomepageNewsSlide < ActiveRecord::Base
  self.table_name = 'homepage_news_slides'
  attr_accessible :image, :link, :position, :text
  include CMS::Orderable
  orderable(:position)
  mount_uploader :image, CMS::Uploader

  belongs_to :author, class_name: 'User'

  def self.name
    'HomepageNewsSlide'
  end
end
