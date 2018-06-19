class Activity < ApplicationRecord
  has_many :question_sets
  has_many :questions, through: :question_sets
end
