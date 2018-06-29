require 'rails_helper'

describe ProgressReportHelper do
  describe '#tab_symbol' do
    let(:user) { double(:user) }

    before do
      allow(helper).to receive(:current_user) { user }
    end

    it 'should return the correct symbols' do
      allow(user).to receive(:premium_state) { "beta" }
      expect(helper.tab_symbol).to eq "BETA"
      allow(user).to receive(:premium_state) { "paid" }
      expect(helper.tab_symbol).to eq "<i class='fa fa-star'></i>"
      allow(user).to receive(:premium_state) { "trial" }
      expect(helper.tab_symbol).to eq "TRIAL"
      allow(user).to receive(:premium_state) { "locked" }
      expect(helper.tab_symbol).to eq "<i class='fa fa-lock'></i>"
    end
  end

  describe '#progress_bar' do
    before do
      allow(helper).to receive(:progress_bar_width) { 100 }
    end

    it 'should give the correct markup' do
      expect(helper.progress_bar).to eq "<div class='premium-bar-progress-bar'><span style='100'></span></div>"
    end
  end

  describe '#trial_activities_numerical_ratio' do
    let(:user) { double(:user, teachers_activity_sessions_since_trial_start_date: [1,2,3,4,5]) }

    before do
      allow(helper).to receive(:current_user) { user }
    end

    it 'should return the ratio of the current activity sessions to the trial limit' do
      expect(helper.trial_activities_numerical_ratio).to eq 5/Teacher::TRIAL_LIMIT
    end
  end

  describe '#progress_bar_width' do
    before do
      allow(helper).to receive(:trial_activities_numerical_ratio) { 0.70 }
    end

    it 'should return the correct width' do
      expect(helper.progress_bar_width).to eq "width: 70.0%"
    end
  end

  describe '#trial_activities_display_ratio' do
    let(:user) { double(:user, teachers_activity_sessions_since_trial_start_date: [1,2,3,4,5]) }

    before do
      allow(helper).to receive(:current_user) { user }
    end

    it 'should return the ratio of the current activity sessions to the trial limit' do
      expect(helper.trial_activities_display_ratio).to eq "#{5} / #{Teacher::TRIAL_LIMIT}"
    end
  end
end