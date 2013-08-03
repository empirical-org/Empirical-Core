class Category < ActiveRecord::Base
  has_many :rules

  def mutable?
    true
  end
end
