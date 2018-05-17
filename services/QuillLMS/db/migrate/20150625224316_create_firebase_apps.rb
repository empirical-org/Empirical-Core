class CreateFirebaseApps < ActiveRecord::Migration
  def change
    create_table :firebase_apps do |t|
      t.string :name
      t.string :secret
      t.timestamps
    end
  end
end
