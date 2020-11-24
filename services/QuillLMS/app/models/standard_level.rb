class StandardLevel < ActiveRecord::Base
  include Uid
  include RankedModel

  ranks :position

  has_many :standards, dependent: :destroy
  has_many :activities, through: :standards
  has_many :change_logs, as: :changed_record

  validates :name, presence: true

  after_commit 'Activity.clear_activity_search_cache'

  before_save :archive_or_unarchive_standards

  accepts_nested_attributes_for :change_logs

  def archive_or_unarchive_standards
    if visible_changed?
      standards.each do |standard|
        standard.update(visible: visible)
      end
    end
  end
end
