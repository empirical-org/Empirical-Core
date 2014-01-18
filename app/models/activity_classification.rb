class ActivityClassification < ActiveRecord::Base
  has_many :instances, class_name: 'ActivityInstance'
end