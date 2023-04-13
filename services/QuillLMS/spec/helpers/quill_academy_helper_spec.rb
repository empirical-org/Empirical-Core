# frozen_string_literal: true

require 'rails_helper'

describe QuillAcademyHelper do
  let!(:user) { create(:user) }
  let!(:school) { create(:school) }
  let!(:school_with_no_subscription) { create(:school) }
  let!(:subscription) { create(:subscription)}
  let!(:school_subscription) { create(:school_subscription, school: school, subscription: subscription) }

  before { allow(helper).to receive(:current_user) { user } }

  describe '#render_quill_academy_button?' do

    context 'app setting enabled' do
      let!(:app_setting) { create(:app_setting, name: 'quill_academy', enabled: true, user_ids_allow_list: [user.id])}

      it 'should return true' do
        expect(helper.render_quill_academy_button?).to eq(true)
      end
    end

    context 'with app setting disabled or user_id not in allow_list' do
      let(:app_setting) { create(:app_setting, name: 'quill_academy', enabled: false, user_ids_allow_list: [user.id])}

      it 'should return false if app setting is disabled' do
        expect(helper.render_quill_academy_button?).to eq(false)
      end

      it 'should return false if app setting is enabled but user_id is not in allow_list' do
        app_setting.enabled = true
        app_setting.user_ids_allow_list = []
        app_setting.save!
        expect(helper.render_quill_academy_button?).to eq(false)
      end
    end
  end
end
