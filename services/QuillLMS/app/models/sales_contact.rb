# == Schema Information
#
# Table name: sales_contacts
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer          not null
#
# Indexes
#
#  index_sales_contacts_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class SalesContact < ActiveRecord::Base
  belongs_to :user
  has_many :stages, class_name: "SalesStage", dependent: :destroy
end
