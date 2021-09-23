class CreateImages < ActiveRecord::Migration[4.2]
  def change
    create_table :images do |t|
      t.string :file
      t.timestamps
    end
  end
end
