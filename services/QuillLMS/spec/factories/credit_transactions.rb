# == Schema Information
#
# Table name: credit_transactions
#
#  id          :integer          not null, primary key
#  amount      :integer          not null
#  source_type :string
#  created_at  :datetime
#  updated_at  :datetime
#  source_id   :integer
#  user_id     :integer          not null
#
# Indexes
#
#  index_credit_transactions_on_source_type_and_source_id  (source_type,source_id)
#  index_credit_transactions_on_user_id                    (user_id)
#
FactoryBot.define do
  factory :credit_transaction do
    user
    amount { 1 }
  end
end
