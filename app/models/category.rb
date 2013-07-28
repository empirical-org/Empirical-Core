class Category < ActiveRecord::Base
  has_many :rules
end
