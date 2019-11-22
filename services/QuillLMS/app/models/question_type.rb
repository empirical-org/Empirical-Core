class QuestionType < ActiveRecord::Base
  has_many :questions, dependent: :destroy
  validates :name, presence: true, uniqueness: true
end
