class AddOrderNumberToActivityClassification < ActiveRecord::Migration
  def change
    add_column :activity_classifications, :order_number, :integer, default: 999999999
  end
end
