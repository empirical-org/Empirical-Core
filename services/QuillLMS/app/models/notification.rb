class Notification < ActiveRecord::Base
  belongs_to :user

  validates :text, presence: true, length: { maximum: 500 }
  validates :user, presence: true
end
