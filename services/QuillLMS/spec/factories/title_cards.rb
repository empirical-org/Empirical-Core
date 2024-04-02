# frozen_string_literal: true

# == Schema Information
#
# Table name: title_cards
#
#  id              :integer          not null, primary key
#  content         :string
#  title           :string
#  title_card_type :string           not null
#  uid             :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_title_cards_on_title_card_type  (title_card_type)
#  index_title_cards_on_uid              (uid) UNIQUE
#
FactoryBot.define do
  factory :title_card do
    uid { SecureRandom.uuid }
    content { 'Some test content' }
    title { 'Card Title' }
    title_card_type { 'connect_title_card' }
  end
end
