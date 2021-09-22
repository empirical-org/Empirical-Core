class AddIndexToSchools < ActiveRecord::Migration[4.2]
  def change
    add_index :schools, :mail_zipcode
  end
end
