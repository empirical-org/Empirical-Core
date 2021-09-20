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
