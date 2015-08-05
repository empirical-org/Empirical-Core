class Concept < ActiveRecord::Base
  validates :name, presence: true
end