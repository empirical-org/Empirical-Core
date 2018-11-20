class AddIndexToSchools < ActiveRecord::Migration
  def change
    add_index :schools, :mail_zipcode
  end
end
