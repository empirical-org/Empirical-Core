class CreateContentPartners < ActiveRecord::Migration
  def change
    create_table :content_partners do |t|
      t.string :name
      t.string :description

      t.timestamps null: false
    end
  end
end
