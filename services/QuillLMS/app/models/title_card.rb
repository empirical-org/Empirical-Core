class TitleCard < ActiveRecord::Base
  validates :uid, presence: true
  validates :content, presence: true
  validates :title, presence: true

  def as_json(options=nil)
    super.except("id")
  end
end
