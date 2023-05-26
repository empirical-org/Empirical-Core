# frozen_string_literal: true

class AddLastLoginToLearnWorldsAccount < ActiveRecord::Migration[6.1]
  def change
    add_column :learn_worlds_accounts, :last_login, :datetime
  end
end
