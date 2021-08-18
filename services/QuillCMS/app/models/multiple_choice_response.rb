class MultipleChoiceResponse < ApplicationRecord
  MIN_COUNT = 10
  include ResponseView
  include ResponseScopes
end
