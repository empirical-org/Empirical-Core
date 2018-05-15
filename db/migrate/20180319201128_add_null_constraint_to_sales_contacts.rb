class AddNullConstraintToSalesContacts < ActiveRecord::Migration
  def change
    change_column_null(:sales_contacts, :user_id, false)
  end
end
