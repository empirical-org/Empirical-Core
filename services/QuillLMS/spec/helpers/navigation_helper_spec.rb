# frozen_string_literal: true

require 'rails_helper'

describe NavigationHelper do
  describe '#home_page_should_be_active?' do
    context 'when action name is dashboard, my account, teacher guide or google sync' do
      before { allow(helper).to receive(:action_name) { "dashboard" } }

      it 'should return true' do
        expect(helper.home_page_should_be_active?).to eq true
      end
    end

    context 'when on subscriptions index' do
      before do
        allow(helper).to receive(:action_name) { "index" }
        allow(helper).to receive(:controller_name) { "subscriptions" }
      end

      it 'should return true' do
        expect(helper.home_page_should_be_active?).to eq true
      end
    end
  end

  describe '#classes_page_should_be_active?' do
    context 'when teachers classroom controller' do
      before { allow(helper).to receive(:controller) { double(:controller, class: Teachers::ClassroomsController) } }

      it 'should return true' do
        expect(helper.classes_page_should_be_active?).to eq true
      end
    end

    context 'when invite_students action and not in concepts controller' do
      let(:class_double) { double(:klass, parent: "something") }

      before do
        allow(helper).to receive(:controller) { double(:controller, class: class_double) }

        without_partial_double_verification do
          allow(helper).to receive(:action_name) { "invite_students" }
          allow(helper).to receive(:controller_name) { "anything" }
        end
      end

      it 'should return true' do
        expect(helper.classes_page_should_be_active?).to eq true
      end
    end
  end

  describe "#assign_activity_page_should_be_active?" do
    before do
      allow(helper).to receive(:controller) { double(:controller, class: Teachers::ClassroomManagerController) }
      without_partial_double_verification { allow(helper).to receive(:action_name) { "assign" } }
    end

    it 'should return true when classroom manager controller and assign activities action' do
      expect(helper.assign_activity_page_should_be_active?).to eq true
    end
  end

  describe '#my_activities_page_should_be_active?' do
    before do
      allow(helper).to receive(:controller) { double(:controller, class: Teachers::ClassroomManagerController) }
      without_partial_double_verification { allow(helper).to receive(:action_name) { "lesson_planner" } }
    end

    it 'should return true if classroom manager controller and lesson planner action' do
      expect(helper.my_activities_page_should_be_active?).to eq true
    end
  end

  describe '#admin_page_should_be_active?' do
    before { allow(helper).to receive(:action_name) { "admin_dashboard" } }

    it 'should return true on admin dashboard action' do
      expect(helper.admin_page_should_be_active?).to eq true
    end
  end

  describe '#Premium_tab_copy' do
    it 'should return the correct values' do
      trial_subscription = create(:subscription)
      premium_subscription = create(:subscription, account_type: 'Not A Trial')
      allow(helper).to receive(:current_user) { double(:user, premium_state: "trial", trial_days_remaining: 5) }
      expect(helper.premium_tab_copy).to eq "Premium  <i class='fas fa-star'></i> 5 Days Left"
      allow(helper).to receive(:current_user) { double(:user, premium_state: "locked", last_expired_subscription: premium_subscription) }
      expect(helper.premium_tab_copy).to eq "Premium  <i class='fas fa-star'></i> Subscription Expired"
      allow(helper).to receive(:current_user) { double(:user, premium_state: "locked", last_expired_subscription: trial_subscription) }
      expect(helper.premium_tab_copy).to eq "Premium  <i class='fas fa-star'></i> Trial Expired"
      allow(helper).to receive(:current_user) { double(:user, premium_state: nil) }
      expect(helper.premium_tab_copy).to eq "Try Premium <i class='fas fa-star'></i>"
      allow(helper).to receive(:current_user) { double(:user, premium_state: "none") }
      expect(helper.premium_tab_copy).to eq "Try Premium <i class='fas fa-star'></i>"
    end
  end

  describe '#should_render_subnav?' do
    it 'should give the true on the right cases' do
      allow(helper).to receive(:home_page_should_be_active?) { true }
      expect(helper.should_render_subnav?).to eq true
      allow(helper).to receive(:home_page_should_be_active?) { false }
      allow(helper).to receive(:classes_page_should_be_active?) { true }
      expect(helper.should_render_subnav?).to eq true
      allow(helper).to receive(:home_page_should_be_active?) { false }
      allow(helper).to receive(:classes_page_should_be_active?) { false }
      allow(helper).to receive(:student_reports_page_should_be_active?) { true }
      expect(helper.should_render_subnav?).to eq true
    end
  end
end
