# frozen_string_literal: true

# == Schema Information
#
# Table name: app_settings
#
#  id                  :integer          not null, primary key
#  enabled             :boolean          default(FALSE), not null
#  enabled_for_staff   :boolean          default(FALSE), not null
#  name                :string           not null
#  percent_active      :integer          default(0), not null
#  user_ids_allow_list :integer          default([]), not null, is an Array
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
# Indexes
#
#  index_app_settings_on_name  (name) UNIQUE
#
require 'rails_helper'

RSpec.describe AppSetting, type: :model do
  let(:user) { create(:user) }

  describe '#enabled?' do
    let!(:app_setting) do
      create(:app_setting, name: 'egosum', enabled: true, percent_active: 100)
    end

    context 'AppSetting does not exist' do
      it 'should return false' do
        expect(AppSetting.enabled?(name: 'nemo', user: user)).to be false
      end
    end

    context 'User and AppSetting exist' do
      it 'should invoke enabled_for_user?' do
        expect(AppSetting.enabled?(name: 'egosum', user: user)).to be true
      end
    end
  end

  describe '#all_enabled_for_user' do
    it 'should return values for globally all enabled app settings' do
      create(:app_setting, name: 'enabled1', enabled: true, percent_active: 100)
      create(:app_setting, name: 'enabled2', enabled: true, percent_active: 100)
      create(:app_setting)
      create(:app_setting)

      expected = {
        'enabled1' => true,
        'enabled2' => true
      }

      expect(AppSetting.all_enabled_for_user(user)).to eq expected
    end
  end

  describe '#enabled_for_user?' do
    context 'override is false' do
      let(:app_setting1) { create(:app_setting, percent_active: 100, enabled: false) }

      it 'should return false' do
        expect(app_setting1.enabled_for_user?(user)).to be false
      end

    end

    context 'user is nil' do
      let(:app_setting1) { create(:app_setting, percent_active: 100, enabled: true) }

      it 'should return false' do
        expect(app_setting1.enabled_for_user?(nil)).to be false
      end
    end

    context 'override is true, staff is true' do
      let(:app_setting1) { create(:app_setting, percent_active: 0, enabled: true, enabled_for_staff: true) }

      it 'should return true when user is staff' do
        allow_any_instance_of(User).to receive(:staff?) { true }
        expect(app_setting1.enabled_for_user?(user)).to be true
      end

      it 'should return true for non-staff user when user is in whitelist' do
        allow_any_instance_of(User).to receive(:staff?) { false }
        app_setting1.user_ids_allow_list = [user.id]

        expect(app_setting1.enabled_for_user?(user)).to be true
      end

      it 'should return false when user does not meet enabled criteria' do
        expect(app_setting1.enabled_for_user?(user)).to be false
      end
    end

  end

  describe '#user_in_rollout_bucket?' do
    let(:one_to_a_hundred) { (1..100).to_a }

    context 'statistical sanity test for hashing algorithm' do
      it 'when percent_active is 50, users should be evenishly distributed' do
        app_setting = create(:app_setting, name: 'lorem1', enabled: true, percent_active: 50)
        result = one_to_a_hundred.count {|r| app_setting.user_in_rollout_bucket?(r) }
        expect(result).to eq 49
      end

      it 'when percent_active is low, few users should be in bucket' do
        app_setting = create(:app_setting, name: 'lorem2', enabled: true, percent_active: 10)
        result = one_to_a_hundred.count {|r| app_setting.user_in_rollout_bucket?(r) }
        expect(result).to eq 8
      end

      it 'when percent_active is high, many users should be in bucket' do
        app_setting = create(:app_setting, name: 'lorem3', enabled: true, percent_active: 95)
        result = one_to_a_hundred.count {|r| app_setting.user_in_rollout_bucket?(r) }
        expect(result).to eq 99
      end

      it 'when percent_active is 100, all users should be in bucket' do
        app_setting = create(:app_setting, name: 'lorem4', enabled: true, percent_active: 100)
        result = one_to_a_hundred.count {|r| app_setting.user_in_rollout_bucket?(r) }
        expect(result).to eq 100
      end
    end

  end
end
