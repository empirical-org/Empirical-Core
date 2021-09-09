class AddTsVectorColumnToBlogPostsTable < ActiveRecord::Migration[4.2]
  def change
    add_column :blog_posts, :tsv, :tsvector
    execute("CREATE INDEX tsv_idx ON blog_posts USING gin(tsv);")
  end
end
