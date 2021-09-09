class AddOrderNumberToActivityClassification < ActiveRecord::Migration[4.2]
  def change
    add_column :activity_classifications, :order_number, :integer, default: 999999999
  end
end
