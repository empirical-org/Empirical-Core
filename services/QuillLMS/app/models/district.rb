# == Schema Information
#
# Table name: districts
#
#  id         :integer          not null, primary key
#  name       :string
#  token      :string
#  created_at :datetime
#  updated_at :datetime
#  clever_id  :string
#
class District < ActiveRecord::Base
  
  has_and_belongs_to_many :users
end
