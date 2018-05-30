class AddPkeyToFirebaseApp < ActiveRecord::Migration
  def change
    add_column :firebase_apps, :pkey, :text
  end
end
