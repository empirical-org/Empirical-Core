class UniqunessValidationForNces < ActiveRecord::Migration
  def change
    add_index :schools, :nces_id, unique: true, name: 'unique_index_schools_on_nces_id', where: "nces_id != ''"
  end
end
