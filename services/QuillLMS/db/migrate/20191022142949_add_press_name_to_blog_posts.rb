class AddPressNameToBlogPosts < ActiveRecord::Migration
  def change
    add_column :blog_posts, :press_name, :string
  end
end
