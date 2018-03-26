class SalesContact < ActiveRecord::Base
  belongs_to :user
  has_many :stages, class_name: "SalesStage", dependent: :destroy
end
