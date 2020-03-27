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
