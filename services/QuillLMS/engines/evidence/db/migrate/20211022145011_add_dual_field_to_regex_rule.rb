class AddDualFieldToRegexRule < ActiveRecord::Migration[5.1]
  def change
    add_column :comprehension_regex_rules, :conditional, :boolean, default: false
  end
end
