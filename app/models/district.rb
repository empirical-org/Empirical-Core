class District < ActiveRecord::Base
  has_and_belongs_to_many :users
end
