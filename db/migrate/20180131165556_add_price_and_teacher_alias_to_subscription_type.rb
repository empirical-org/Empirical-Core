class AddPriceAndTeacherAliasToSubscriptionType < ActiveRecord::Migration
  def change
    add_column :subscription_types, :price, :integer
    add_column :subscription_types, :teacher_alias, :string
  end
end
