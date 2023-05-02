# frozen_string_literal: true

require 'rails_helper'

describe NavbarHelper do

  describe '#determine_mobile_navbar_tabs' do

    let(:tabs) { [NavbarHelper::HOME_TAB, NavbarHelper::OVERVIEW_TAB, NavbarHelper::MY_CLASSES_TAB, NavbarHelper::ASSIGN_ACTIVITIES_TAB, NavbarHelper::MY_ACTIVITIES_TAB, NavbarHelper::MY_REPORTS_TAB]}
    let(:teacher) { create(:teacher) }
    let(:admin) { create(:admin) }

    context 'when there is no current_user' do

      before { allow(helper).to receive(:current_user) { nil } }

      it 'should return UNAUTHED_USER_TABS array' do
        expect(helper.determine_mobile_navbar_tabs).to eq(NavbarHelper::UNAUTHED_USER_TABS)
      end
    end

    context 'when current_user is a student' do
      before do
        allow(helper).to receive(:current_user) { create(:student) }
      end

      it 'should return STUDENT_CENTER_TABS array' do
        expect(helper.determine_mobile_navbar_tabs).to eq(NavbarHelper::STUDENT_TABS)
      end
    end

    context 'when current_user is not a premium user' do
      before do
        allow(helper).to receive(:current_user) { teacher }
        allow(teacher).to receive(:should_render_teacher_premium?).and_return(false)
      end

      it 'should return the expected tabs' do
        expected_tabs = tabs.push(NavbarHelper::PREMIUM_TAB)
        tabs.push(NavbarHelper::QUILL_ACADEMY_TAB)
        expected_tabs.concat(NavbarHelper::COMMON_AUTHED_USER_TABS)
        expect(helper.determine_mobile_navbar_tabs).to eq(expected_tabs)
      end
    end

    context 'when current_user is a teacher premium user' do
      before do
        allow(helper).to receive(:current_user) { teacher }
        allow(teacher).to receive(:should_render_teacher_premium?).and_return(true)
      end

      it 'should return the expected tabs' do
        expected_tabs = tabs.push(NavbarHelper::TEACHER_PREMIUM_TAB)
        tabs.push(NavbarHelper::QUILL_ACADEMY_TAB)
        expected_tabs.concat(NavbarHelper::COMMON_AUTHED_USER_TABS)
        expect(helper.determine_mobile_navbar_tabs).to eq(expected_tabs)
      end
    end

    context 'when current_user is a non-premium admin user' do
      before do
        allow(helper).to receive(:current_user) { admin }
        allow(teacher).to receive(:should_render_teacher_premium?).and_return(false)
        allow(teacher).to receive(:admin?).and_return(true)
      end

      it 'should return the expected tabs' do
        expected_tabs = tabs.concat([NavbarHelper::PREMIUM_TAB, NavbarHelper::PREMIUM_HUB_TAB, NavbarHelper::QUILL_ACADEMY_TAB])
        expected_tabs.concat(NavbarHelper::COMMON_AUTHED_USER_TABS)
        expect(helper.determine_mobile_navbar_tabs).to eq(expected_tabs)
      end
    end

    context 'when current_user is a premium admin user' do
      before do
        allow(helper).to receive(:current_user) { admin }
        allow(admin).to receive(:should_render_teacher_premium?).and_return(false)
        allow(admin).to receive(:admin?).and_return(true)
      end

      it 'should return the expected tabs' do
        subscription = create(:subscription, account_type: Subscription::SCHOOL_PAID)
        create(:user_subscription, user: admin, subscription: subscription)

        expected_tabs = tabs.concat([NavbarHelper::PREMIUM_HUB_TAB, NavbarHelper::QUILL_ACADEMY_TAB])
        expected_tabs.concat(NavbarHelper::COMMON_AUTHED_USER_TABS)
        expect(helper.determine_mobile_navbar_tabs).to eq(expected_tabs)
      end
    end
  end
end
