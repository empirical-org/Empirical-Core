class AddNullConstraintToSalesContacts < ActiveRecord::Migration[4.2]
  def change
    change_column_null(:sales_contacts, :user_id, false)
  end
end
