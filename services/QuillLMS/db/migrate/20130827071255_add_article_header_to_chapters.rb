class AddArticleHeaderToChapters < ActiveRecord::Migration[4.2]
  def change
    rename_column :chapters, :description, :article_header
    add_column :chapters, :description, :text
  end
end
