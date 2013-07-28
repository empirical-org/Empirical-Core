class Assignment < ActiveRecord::Base
  belongs_to :user
  belongs_to :chapter
  has_many :scores, dependent: :destroy
end
