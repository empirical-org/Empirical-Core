class CreateBlogPost < ActiveRecord::Migration
  def change
    create_table :blog_posts do |t|
      t.string :title, null: false, index: true, unique: true
      t.text :body, null: false
      t.text :subtitle
      t.timestamps
      t.integer :read_count, null: false, default: 0, index: true
      t.string :topic, index: true
      t.boolean :draft, default: true
      t.integer :author_id, index: true
    end
  end
end
