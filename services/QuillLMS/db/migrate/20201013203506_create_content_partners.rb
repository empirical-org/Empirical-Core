class CreateContentPartners < ActiveRecord::Migration[4.2]
  def change
    create_table :content_partners do |t|
      t.string :name, :null => false
      t.string :description

      t.timestamps null: false
    end
  end
end
