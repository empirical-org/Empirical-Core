# This migration comes from comprehension (originally 20210219163806)
class AddImageLinkAndImageAltTextToPassages < ActiveRecord::Migration[4.2]
  def change
    add_column :comprehension_passages, :image_link, :string
    add_column :comprehension_passages, :image_alt_text, :string, default: ''
  end
end
