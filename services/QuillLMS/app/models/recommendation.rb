class Recommendation < ActiveRecord::Base
  enum types: [:independent_practice, :group_lesson]
end
