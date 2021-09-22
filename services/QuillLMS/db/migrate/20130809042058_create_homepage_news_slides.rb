class CreateHomepageNewsSlides < ActiveRecord::Migration[4.2]
  def change
    create_table :homepage_news_slides do |t|
      t.string :link
      t.integer :position
      t.string :image
      t.text :text
      t.belongs_to :author
      t.timestamps
    end


  end
end
