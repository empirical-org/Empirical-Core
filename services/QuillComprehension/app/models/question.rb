class Question < ApplicationRecord
  belongs_to :question_set
  delegate :activity, :to => :question_set, :allow_nil => true
  has_many :responses
end
