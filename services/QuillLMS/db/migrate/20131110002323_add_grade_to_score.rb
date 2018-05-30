class AddGradeToScore < ActiveRecord::Migration
  def change
    add_column :scores, :grade, :float
  end
end
