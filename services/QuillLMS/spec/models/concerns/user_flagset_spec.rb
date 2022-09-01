# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserFlagset, type: :model do

  context 'validations' do
    it 'should validate flagset is a member of FLAGSETS' do
      expect { create(:user) }.to_not raise_error
      expect { create(:user, flagset: 'bad-flagset' ) }.to raise_error(ActiveRecord::RecordInvalid)
    end
  end

  context '#flags_for_flagset' do
    it 'should return an string array of flags' do
      result = UserFlagset.flags_for_flagset('college_board')
      expect(result).to eq "'#{Flags::COLLEGE_BOARD}','#{Flags::PRODUCTION}'"
    end
  end

  context '#activity_viewable?' do
    let(:normal_user) { create(:user, flagset: 'production' ) }
    let(:alpha_user) { create(:user, flagset: 'alpha' ) }

    let(:alpha_activity) { create(:activity, flags: ['alpha']) }
    let(:normal_activity) { create(:activity, flags: ['production']) }

    it 'should return correct values' do
      expect(normal_user.activity_viewable?('bad input')).to eq false
      expect(normal_user.activity_viewable?(normal_activity)).to eq true
      expect(normal_user.activity_viewable?(alpha_activity)).to eq false
      expect(alpha_user.activity_viewable?(alpha_activity)).to eq true
      expect(alpha_user.activity_viewable?(normal_activity)).to eq true
    end

  end

end
