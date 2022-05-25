# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_sessions
#
#  id                    :integer          not null, primary key
#  completed_at          :datetime
#  data                  :jsonb
#  is_final_score        :boolean
#  is_retry              :boolean
#  percentage            :float
#  started_at            :datetime
#  state                 :string(255)
#  temporary             :boolean
#  timespent             :integer
#  uid                   :string(255)
#  visible               :boolean
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
#  newest_activity_sessions_activity_id_idx        (activity_id)
#  newest_activity_sessions_classroom_unit_id_idx  (classroom_unit_id)
#  newest_activity_sessions_state_idx              (state)
#  newest_activity_sessions_uid_idx                (uid)
#  newest_activity_sessions_user_id_idx            (user_id)
#  newest_activity_sessions_visible_idx            (visible)
#
require 'rails_helper'

describe ActivitySessionSerializer, type: :serializer do
  it_behaves_like 'serializer' do
    let(:record_instance) { create(:activity_session)}
    let(:concept)         { create(:concept) }

    let(:expected_serialized_keys) do
      %w(activity_uid
         anonymous
         completed_at
         data
         percentage
         state
         temporary
         uid)
    end
  end
end
