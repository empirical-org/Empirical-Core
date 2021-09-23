class AddPressNameToBlogPosts < ActiveRecord::Migration[4.2]
  def change
    add_column :blog_posts, :press_name, :string
  end
end
