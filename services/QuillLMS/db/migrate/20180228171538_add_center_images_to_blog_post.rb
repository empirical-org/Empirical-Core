# frozen_string_literal: true

class AddCenterImagesToBlogPost < ActiveRecord::Migration[4.2]
  def change
    add_column :blog_posts, :center_images, :boolean
  end
end
