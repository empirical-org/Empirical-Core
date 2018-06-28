class Criterion < ActiveRecord::Base
  belongs_to :recommendation
  belongs_to :concept
  validates :recommendation, :concept, :category, :count, presence: true
  validates :category, uniqueness: {
    scope: :recommendation,
    message: "of this type already added to recommendation"
  }

  enum category: { correct_submissions: 0, incorrect_submissions: 1 }
end
