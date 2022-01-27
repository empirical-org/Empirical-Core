# frozen_string_literal: true

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
class CreditTransaction < ApplicationRecord
  belongs_to :user
  belongs_to :source, polymorphic: true

  def action
    case source_type
    when 'Subscription'
      'You subscribed to Quill Premium'
    when 'ReferralsUser'
      'Someone you referred became a Quill user'
    end
  end
end
