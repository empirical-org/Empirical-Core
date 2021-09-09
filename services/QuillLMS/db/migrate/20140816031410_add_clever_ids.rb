class AddCleverIds < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :clever_id, :string
    add_column :classrooms, :clever_id, :string
    add_column :schools, :clever_id, :string
  end
end
