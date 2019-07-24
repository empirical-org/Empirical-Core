class CreateSchoolsAdmins < ActiveRecord::Migration
  def change
    create_table :schools_admins do |t|
      t.integer :user_id, index: true
      t.integer :school_id, index: true
      t.timestamps
    end
    add_index :schools_admins, [:school_id, :user_id], unique: true
  end
end
