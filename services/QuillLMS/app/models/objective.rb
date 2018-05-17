class Objective < ActiveRecord::Base
  has_many :checkboxes
  has_many :users, through: :checkboxes

end
