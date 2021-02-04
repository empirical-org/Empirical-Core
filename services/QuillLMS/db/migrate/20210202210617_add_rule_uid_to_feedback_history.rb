class AddRuleUidToFeedbackHistory < ActiveRecord::Migration
  def change
    add_column :feedback_histories, :rule_uid, :string
    add_index :feedback_histories, :rule_uid
  end
end
