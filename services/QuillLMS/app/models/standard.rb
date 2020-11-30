class Standard < ActiveRecord::Base
  include Uid

  belongs_to :standard_level
  belongs_to :standard_category

  has_many :activities, dependent: :nullify
  has_many :change_logs, as: :changed_record

  default_scope -> { order(:name) }

  validates :standard_level, presence: true
  validates :name, presence: true, uniqueness: true

  accepts_nested_attributes_for :change_logs

  after_commit 'Activity.clear_activity_search_cache'

  def name_prefix
    name.split(' ').first
  end
end
