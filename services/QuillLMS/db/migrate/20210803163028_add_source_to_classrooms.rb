class AddSourceToClassrooms < ActiveRecord::Migration[5.1]
  def change
    add_column :classrooms, :source, :string
  end
end
