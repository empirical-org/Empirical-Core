class Criterion < ActiveRecord::Base
  belongs_to :recommendation
  belongs_to :concept
  validates :recommendation, :concept, :count, presence: true
  validates :no_incorrect, inclusion: [ true, false ]
end
