class UniqunessValidationForNces < ActiveRecord::Migration
  def change
    add_index :schools, :nces_id, unique: true, name: 'unique_index_nces_id_on_schools'
  end
end
