class Criterion < ActiveRecord::Base
  belongs_to :recommendation
  belongs_to :concept

  enum category: { correct_submissions: 0, incorrect_submissions: 1 }
end
