# == Schema Information
#
# Table name: content_partners
#
#  id          :integer          not null, primary key
#  description :string
#  name        :string           not null
#  visible     :boolean          default(TRUE)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class ContentPartner < ActiveRecord::Base
  has_many :content_partner_activities, dependent: :destroy
  has_many :activities, :through => :content_partner_activities

  validates :name, presence: true

  after_commit { Activity.clear_activity_search_cache }
end
