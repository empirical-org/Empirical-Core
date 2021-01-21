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
class ActiveActivitySession < ActiveRecord::Base
  validates :data, presence: true
  validates :uid, presence: true, uniqueness: true
  validate :data_must_be_hash

  def as_json(options=nil)
    data
  end

  private def data_must_be_hash
    errors.add(:data, "must be a hash") unless data.is_a?(Hash)
  end
end
