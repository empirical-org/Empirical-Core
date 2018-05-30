# This is only used for the Clever Integration, leanm on the schools column is how we group schools into districts.
class District < ActiveRecord::Base
  
  has_and_belongs_to_many :users
end
