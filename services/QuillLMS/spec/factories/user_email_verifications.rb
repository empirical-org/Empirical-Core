# frozen_string_literal: true

# == Schema Information
#
# Table name: user_email_verifications
#
#  id                  :bigint           not null, primary key
#  verification_method :string
#  verification_token  :string
#  verified_at         :datetime
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  user_id             :bigint
#
# Indexes
#
#  index_user_email_verifications_on_user_id  (user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :user_email_verification do
    user
  end
end

