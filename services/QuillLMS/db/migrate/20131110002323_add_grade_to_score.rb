class AddGradeToScore < ActiveRecord::Migration[4.2]
  def change
    add_column :scores, :grade, :float
  end
end
