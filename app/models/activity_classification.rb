class ActivityClassification < ActiveRecord::Base
  has_many :activities, dependent: :destroy
end