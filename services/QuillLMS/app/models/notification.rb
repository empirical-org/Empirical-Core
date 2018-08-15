class Notification < ActiveRecord::Base
  validates :text, presence: true, length: { maximum: 500 }
end
