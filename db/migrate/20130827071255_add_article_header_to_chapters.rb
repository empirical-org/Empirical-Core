class AddArticleHeaderToChapters < ActiveRecord::Migration
  def change
    rename_column :chapters, :description, :article_header
    add_column :chapters, :description, :text
  end
end
