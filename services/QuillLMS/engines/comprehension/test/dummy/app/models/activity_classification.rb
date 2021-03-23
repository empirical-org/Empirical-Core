class ActivityClassification < ActiveRecord::Base
  COMPREHENSION_KEY = 'comprehension'

  def self.comprehension
    find_by_key COMPREHENSION_KEY
  end
end
