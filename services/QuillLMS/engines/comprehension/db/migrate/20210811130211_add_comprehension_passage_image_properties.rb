class AddComprehensionPassageImageProperties < ActiveRecord::Migration[5.1]
  def change
    add_column :comprehension_passages, :image_caption, :string, default: ''
    add_column :comprehension_passages, :image_author, :string, default: ''
    add_column :comprehension_passages, :image_source, :string, default: ''
  end
end
