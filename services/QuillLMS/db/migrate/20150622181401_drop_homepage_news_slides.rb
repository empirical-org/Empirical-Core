# frozen_string_literal: true

class DropHomepageNewsSlides < ActiveRecord::Migration[4.2]
  def change
    drop_table :homepage_news_slides
  end
end
