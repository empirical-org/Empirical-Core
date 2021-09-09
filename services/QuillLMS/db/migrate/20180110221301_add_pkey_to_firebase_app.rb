class AddPkeyToFirebaseApp < ActiveRecord::Migration[4.2]
  def change
    add_column :firebase_apps, :pkey, :text
  end
end
