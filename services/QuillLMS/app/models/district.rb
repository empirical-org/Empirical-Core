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
# This is only used for the Clever Integration, leanm on the schools column is how we group schools into districts.
class District < ActiveRecord::Base
  
  has_and_belongs_to_many :users
end
