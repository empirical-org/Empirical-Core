class CreateResponseLabels < ActiveRecord::Migration[5.2]
  def change
    create_table :response_labels do |t|
      t.text :name
      t.text :description

      t.timestamps
    end
  end
end
