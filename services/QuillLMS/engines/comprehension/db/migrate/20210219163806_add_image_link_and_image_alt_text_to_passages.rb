class AddImageLinkAndImageAltTextToPassages < ActiveRecord::Migration
  def change
    add_column :comprehension_passages, :image_link, :string
    add_column :comprehension_passages, :image_alt_text, :string, default: ''
  end
end
