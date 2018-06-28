class Criterion < ActiveRecord::Base
  enum category: { correct_submissions: 0, incorrect_submissions: 1 }
end
