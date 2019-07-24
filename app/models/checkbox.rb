class Checkbox < ActiveRecord::Base
  belongs_to :objective
  belongs_to :user
  validates :objective_id, uniqueness: { scope: :user_id, message: "should only be checked once per user" }
end
