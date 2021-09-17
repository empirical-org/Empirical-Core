# == Schema Information
#
# Table name: active_activity_sessions
#
#  id         :integer          not null, primary key
#  data       :jsonb
#  uid        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_active_activity_sessions_on_uid  (uid) UNIQUE
#
class ActiveActivitySession < ApplicationRecord
  validates :data, presence: true
  validates :uid, presence: true, uniqueness: true
  validate :data_must_be_hash

  belongs_to :activity_session, -> { unscope(where: :visible) }, foreign_key: :uid, primary_key: :uid

  # Pulls sessions that are finished or their classroom unit are archived
  # These sessions can be deleted
  # Should use with a .limit()
  scope :obsolete, lambda {
    joins(:activity_session)
    .merge(ActivitySession.unscoped.joins(:classroom_unit))
    .where("classroom_units.visible = false OR activity_sessions.completed_at IS NOT NULL")
  }

  def as_json(options=nil)
    data
  end

  private def data_must_be_hash
    errors.add(:data, "must be a hash") unless data.is_a?(Hash)
  end
end
