# frozen_string_literal: true

# == Schema Information
#
# Table name: learn_worlds_accounts
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  external_id :string           not null
#  user_id     :bigint
#
# Indexes
#
#  index_learn_worlds_accounts_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :learn_worlds_account do
    user
    external_id { SecureRandom.hex(12) }
  end
end
