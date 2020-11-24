class StandardCategory < ActiveRecord::Base
  include Uid
	has_many :standards
  has_many :activities, through: :standards
  has_many :change_logs, as: :changed_record

	validates :name, presence: true, uniqueness: true

  accepts_nested_attributes_for :change_logs

  after_commit 'Activity.clear_activity_search_cache'
end
