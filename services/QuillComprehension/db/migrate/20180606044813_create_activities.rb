class CreateActivities < ActiveRecord::Migration[5.2]
  def change
    create_table :activities do |t|
      t.string :title
      t.text :article
      t.text :description

      t.timestamps
    end
  end
end
