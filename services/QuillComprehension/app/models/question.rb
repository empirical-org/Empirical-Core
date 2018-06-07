class Question < ApplicationRecord
  belongs_to :activity
  has_many :responses
end
