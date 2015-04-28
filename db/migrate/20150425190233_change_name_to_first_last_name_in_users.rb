class ChangeNameToFirstLastNameInUsers < ActiveRecord::Migration
  def up
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    User.find_each do |user|
      name_split = user.name.split(/\s/)
      user.first_name = name_split[0]
      user.last_name = name_split[-1]
      user.save!
    end
    remove_column :users, :name
  end

  def down
    add_column :users, :name, :string
    User.find_each do |user|
      user.name = user.first_name + ' ' + user.last_name
      user.save!
    end
    remove_column :users, :first_name
    remove_column :users, :last_name
  end
end
