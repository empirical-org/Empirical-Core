# frozen_string_literal: true

class AddFooterContentToBlogPost < ActiveRecord::Migration[6.1]
  def change
    add_column :blog_posts, :footer_content, :text, default: ''
  end
end
