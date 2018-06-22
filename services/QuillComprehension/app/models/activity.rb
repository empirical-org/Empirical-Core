class Activity < ApplicationRecord
  has_many :vocabulary_words
  has_many :question_sets
  has_many :questions, through: :question_sets
end
