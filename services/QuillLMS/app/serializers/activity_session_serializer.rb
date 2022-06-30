# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_sessions
#
#  id                    :integer          not null, primary key
#  completed_at          :datetime
#  data                  :jsonb
#  is_final_score        :boolean          default(FALSE)
#  is_retry              :boolean          default(FALSE)
#  percentage            :float
#  started_at            :datetime
#  state                 :string           default("unstarted"), not null
#  temporary             :boolean          default(FALSE)
#  timespent             :integer
#  uid                   :string
#  visible               :boolean          default(TRUE), not null
#  created_at            :datetime
#  updated_at            :datetime
#  activity_id           :integer
#  classroom_activity_id :integer
#  classroom_unit_id     :integer
#  pairing_id            :string
#  user_id               :integer
#
# Indexes
#
#  index_activity_sessions_on_activity_id            (activity_id)
#  index_activity_sessions_on_classroom_activity_id  (classroom_activity_id)
#  index_activity_sessions_on_classroom_unit_id      (classroom_unit_id)
#  index_activity_sessions_on_completed_at           (completed_at)
#  index_activity_sessions_on_pairing_id             (pairing_id)
#  index_activity_sessions_on_started_at             (started_at)
#  index_activity_sessions_on_state                  (state)
#  index_activity_sessions_on_uid                    (uid) UNIQUE
#  index_activity_sessions_on_user_id                (user_id)
#
class ActivitySessionSerializer < ApplicationSerializer
  attributes :uid, :percentage, :state, :completed_at, :data, :temporary,
              :activity_uid, :anonymous
end
