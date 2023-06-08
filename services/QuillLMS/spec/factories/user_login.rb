# frozen_string_literal: true

# == Schema Information
#
# Table name: user_logins
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_user_logins_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :user_login do
    user { create(:teacher) }
  end
end
