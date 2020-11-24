class StandardCategory < ActiveRecord::Base
  include Uid
	has_many :standards
  has_many :activities, through: :standards
  has_many :change_logs, as: :changed_record

	validates :name, presence: true, uniqueness: true

  accepts_nested_attributes_for :change_logs

  after_commit 'Activity.clear_activity_search_cache'

  before_save :archive_standards_if_archived

  def archive_standards_if_archived
    if visible_changed? && !visible
      standards.each do |standard|
        standard.update(visible: visible)
      end
    end
  end

end
