class CreateSalesStageTypesTable < ActiveRecord::Migration
  def change
    create_table :sales_stage_types do |t|
      t.text :description
      t.text :name
      t.string :order

      t.timestamps
    end
  end
end
