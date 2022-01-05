class AddUniversalIndexToEvidenceRules < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!
  def change
    add_index :comprehension_rules, :universal, where: "universal", algorithm: :concurrently
  end
end
