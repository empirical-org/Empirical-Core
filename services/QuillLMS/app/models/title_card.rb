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
class TitleCard < ActiveRecord::Base
  TYPES = [
    TYPE_CONNECT = 'connect_title_card',
    TYPE_DIAGNOSTIC = 'diagnostic_title_card'
  ]
  validates :uid, presence: true, uniqueness: true
  validates :content, presence: true
  validates :title, presence: true
  validates :title_card_type, presence: true, inclusion: {in: TYPES}

  def as_json(options=nil)
    super(options).except("id")
  end
end
