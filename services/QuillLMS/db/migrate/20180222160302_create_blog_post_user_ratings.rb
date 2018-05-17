class CreateBlogPostUserRatings < ActiveRecord::Migration
  def change
    create_table :blog_post_user_ratings do |t|
      t.integer :blog_post_id
      t.integer :user_id
      t.integer :rating
      t.timestamps null: false
    end
  end
end
