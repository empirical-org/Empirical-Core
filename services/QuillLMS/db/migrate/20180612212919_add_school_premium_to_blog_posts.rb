class AddSchoolPremiumToBlogPosts < ActiveRecord::Migration
  def change
    add_column :blog_posts, :school_premium, :boolean, default: false
  end
end
