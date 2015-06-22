class DropHomepageNewsSlides < ActiveRecord::Migration
  def change
    drop_table :homepage_news_slides
  end
end
