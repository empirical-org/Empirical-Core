class RemoveDistrictColumnsFromSchools < ActiveRecord::Migration[5.1]
  def change
    remove_column :schools, :leanm
    remove_column :schools, :lea_id
  end
end
