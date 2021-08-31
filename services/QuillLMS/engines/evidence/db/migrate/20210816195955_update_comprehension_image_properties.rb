class UpdateComprehensionImageProperties < ActiveRecord::Migration[5.1]
  def change
    add_column :comprehension_passages, :image_attribution, :text, default: ''
    change_column :comprehension_passages, :image_caption, :text, default: ''
    remove_column :comprehension_passages, :image_author
    remove_column :comprehension_passages, :image_source
  end
end
