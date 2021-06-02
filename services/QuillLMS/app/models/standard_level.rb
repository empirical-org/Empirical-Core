# == Schema Information
#
# Table name: standard_levels
#
#  id         :integer          not null, primary key
#  name       :string
#  position   :integer
#  uid        :string
#  visible    :boolean          default(TRUE)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class StandardLevel < ActiveRecord::Base
  include Uid
  include RankedModel
  include ArchiveAssociatedStandards

  ranks :position

  has_many :standards, dependent: :destroy
  has_many :activities, through: :standards
  has_many :change_logs, as: :changed_record

  validates :name, presence: true

  after_commit { Activity.clear_activity_search_cache }

  accepts_nested_attributes_for :change_logs
end
