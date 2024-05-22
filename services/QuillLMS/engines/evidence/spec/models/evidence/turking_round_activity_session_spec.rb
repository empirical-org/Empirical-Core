# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_turking_round_activity_sessions
#
#  id                   :integer          not null, primary key
#  turking_round_id     :integer
#  activity_session_uid :string
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#
require 'rails_helper'

module Evidence
  RSpec.describe(TurkingRoundActivitySession, :type => :model) do

    context 'should validations' do

      it { should validate_presence_of(:activity_session_uid) }

      it { should validate_presence_of(:turking_round_id) }

      it { should validate_uniqueness_of(:activity_session_uid) }
    end

    context 'relationships' do
      it { should belong_to(:turking_round) }
    end
  end
end
