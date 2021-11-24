# frozen_string_literal: true

class AddPreviewCardContentToBlogPostsTable < ActiveRecord::Migration[4.2]
  def change
    add_column :blog_posts, :preview_card_content, :text, null: false
  end
end
