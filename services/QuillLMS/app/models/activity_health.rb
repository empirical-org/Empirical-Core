# == Schema Information
#
# Table name: activity_healths
#
#  id                      :integer          not null, primary key
#  activity_categories     :string           is an Array
#  activity_packs          :string           is an Array
#  avg_common_unmatched    :float
#  avg_completion_time     :time
#  avg_difficulty          :float
#  content_partners        :string           is an Array
#  diagnostics             :string           is an Array
#  name                    :string
#  recent_assignments      :integer
#  standard_dev_difficulty :float
#  tool                    :string
#  url                     :string
#
class ActivityHealth < ActiveRecord::Base
  ALLOWED_TOOLS = %w(connect grammar)

  has_many :prompt_healths

  validates :tool, inclusion: { in: ALLOWED_TOOLS, allow_nil: true}
  validates :recent_assignments, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
  validates :avg_difficulty, inclusion: { in: 0..5, allow_nil: true }
end
