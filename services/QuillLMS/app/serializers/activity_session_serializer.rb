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
#  state                 :string(255)      default("unstarted"), not null
#  temporary             :boolean          default(FALSE)
#  timespent             :integer
#  uid                   :string(255)
#  visible               :boolean          default(TRUE), not null
#  created_at            :datetime
#  updated_at            :datetime
#  activity_id           :integer
#  classroom_activity_id :integer
#  classroom_unit_id     :integer
#  pairing_id            :string(255)
#  user_id               :integer
#
# Indexes
#
#  new_activity_sessions_activity_id_idx        (activity_id)
#  new_activity_sessions_classroom_unit_id_idx  (classroom_unit_id)
#  new_activity_sessions_completed_at_idx       (completed_at)
#  new_activity_sessions_uid_idx                (uid) UNIQUE
#  new_activity_sessions_uid_key                (uid) UNIQUE
#  new_activity_sessions_user_id_idx            (user_id)
#
class ActivitySessionSerializer < ApplicationSerializer
  attributes :uid, :percentage, :state, :completed_at, :data, :temporary,
              :activity_uid, :anonymous
end
