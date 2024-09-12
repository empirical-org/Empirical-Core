# frozen_string_literal: true

require 'rails_helper'

describe NavigationHelper do
  describe '#home_page_active?' do
    context 'when action name is dashboard, my account, teacher guide or google sync' do
      before { allow(helper).to receive(:action_name) { 'dashboard' } }

      it 'should return true' do
        expect(helper.home_page_active?).to eq true
      end
    end

    context 'when on subscriptions index' do
      before do
        allow(helper).to receive(:action_name) { 'index' }
        allow(helper).to receive(:controller_name) { 'subscriptions' }
      end

      it 'should return true' do
        expect(helper.home_page_active?).to eq true
      end
    end
  end

  describe '#classes_page_active?' do
    context 'when teachers classroom controller' do
      before { allow(helper).to receive(:controller) { double(:controller, class: Teachers::ClassroomsController) } }

      it 'should return true' do
        expect(helper.classes_page_active?).to eq true
      end
    end

    context 'when invite_students action and not in concepts controller' do
      let(:class_double) { double(:klass, module_parent: 'something') }

      before do
        allow(helper).to receive(:controller) { double(:controller, class: class_double) }

        without_partial_double_verification do
          allow(helper).to receive(:action_name) { 'invite_students' }
          allow(helper).to receive(:controller_name) { 'anything' }
        end
      end

      it 'should return true' do
        expect(helper.classes_page_active?).to eq true
      end
    end
  end

  describe '#assign_activity_page_active?' do
    before do
      allow(helper).to receive(:controller) { double(:controller, class: Teachers::ClassroomManagerController) }
      without_partial_double_verification { allow(helper).to receive(:action_name) { 'assign' } }
    end

    it 'should return true when classroom manager controller and assign activities action' do
      expect(helper.assign_activity_page_active?).to eq true
    end
  end

  describe '#manage_activities_page_active?' do
    before do
      allow(helper).to receive(:controller) { double(:controller, class: Teachers::ClassroomManagerController) }
      without_partial_double_verification { allow(helper).to receive(:action_name) { 'lesson_planner' } }
    end

    it 'should return true if classroom manager controller and lesson planner action' do
      expect(helper.manage_activities_page_active?).to eq true
    end
  end

  describe '#admin_page_active?' do
    before { allow(helper).to receive(:action_name) { 'premium_hub' } }

    it 'should return true on premium hub action' do
      expect(helper.admin_page_active?).to eq true
    end
  end

  describe '#teacher_premium_active?' do
    before { allow(helper).to receive(:action_name) { 'teacher_premium' } }

    it 'should return true on teacher premium action' do
      expect(helper.teacher_premium_active?).to eq true
    end
  end

  describe '#premium_tab_copy' do
    subject { helper.premium_tab_copy(current_user) }

    let(:trial_subscription) { create(:subscription) }
    let(:premium_subscription) { create(:subscription, account_type: 'Not A Trial') }

    context 'user has 5 days left in trial' do
      let(:current_user) { double(:user, premium_state: 'trial', trial_days_remaining: 5) }

      it { is_expected.to eq "<span>Premium</span><div class='large-diamond-icon is-in-middle'></div><span>5 Days Left</span>" }
    end

    context 'user has locked premium subscription' do
      let(:current_user) { double(:user, premium_state: 'locked', last_expired_subscription: premium_subscription) }

      it { is_expected.to eq "<span>Premium</span><div class='large-diamond-icon is-in-middle'></div><span>Expired</span>" }
    end

    context 'user has locked trial subscription' do
      let(:current_user) { double(:user, premium_state: 'locked', last_expired_subscription: trial_subscription) }

      it { is_expected.to eq "<span>Premium</span><div class='large-diamond-icon is-in-middle'></div><span>Trial Expired</span>" }
    end

    context 'user has nil premium state' do
      let(:current_user) { double(:user, premium_state: nil) }

      it { is_expected.to eq "<span>Explore Premium</span><div class='large-diamond-icon'></div>" }
    end

    context "user has 'none' premium state" do
      let(:current_user) { double(:user, premium_state: 'none') }

      it { is_expected.to eq "<span>Explore Premium</span><div class='large-diamond-icon'></div>" }
    end
  end

  describe '#should_render_subnav?' do
    it 'should give the true on the right cases' do
      allow(helper).to receive(:home_page_active?) { true }
      expect(helper.should_render_subnav?).to eq true
      allow(helper).to receive(:home_page_active?) { false }
      allow(helper).to receive(:classes_page_active?) { true }
      expect(helper.should_render_subnav?).to eq true
      allow(helper).to receive(:home_page_active?) { false }
      allow(helper).to receive(:classes_page_active?) { false }
      allow(helper).to receive(:student_reports_page_active?) { true }
      expect(helper.should_render_subnav?).to eq true
    end
  end

  describe '#admin_tab_access?' do
    subject { helper.admin_tab_access?(current_user) }

    context 'when current user is student' do
      let(:current_user) { create(:student) }

      it { is_expected.to eq false }
    end

    context 'when current user is admin' do
      let(:current_user) { create(:admin) }

      it { is_expected.to eq false }
    end

    context 'when current user is teacher' do
      let(:current_user) { create(:teacher) }

      it { is_expected.to eq false }

      context 'when current user has an alternative school' do
        let(:school) { create(:school, name: School::ALTERNATIVE_SCHOOL_NAMES.sample) }

        before { create(:schools_users, user: current_user, school: school).user.reload }

        it { is_expected.to eq false }
      end

      context 'when current user has a school that is not an alternative one' do
        let(:school) { create(:school) }

        before { create(:schools_users, user: current_user, school: school).user.reload }

        it { is_expected.to eq true }
      end
    end
  end

  describe '#determine_mobile_navbar_tabs' do
    subject { helper.determine_mobile_navbar_tabs(current_user) }

    let(:tabs) do
      [
        helper.home_tab,
        helper.overview_tab,
        helper.manage_classes_tab,
        NavigationHelper::ASSIGN_ACTIVITIES_TAB,
        helper.manage_activities_tab,
        helper.view_reports_tab
      ]
    end

    let(:teacher) { create(:teacher) }
    let(:admin) { create(:admin) }

    context 'when there is no current_user' do
      let(:current_user) { nil }

      it 'should return UNAUTHED_USER_TABS array' do
        expect(subject).to eq(NavigationHelper::UNAUTHED_USER_TABS)
      end
    end

    context 'when current_user is a student' do
      let(:current_user) { create(:student) }

      it 'should return STUDENT_CENTER_TABS array' do
        expect(subject).to eq(NavigationHelper::STUDENT_TABS)
      end
    end

    context 'when current_user is not a premium user' do
      let(:current_user) { teacher }

      before { allow(teacher).to receive(:should_render_teacher_premium?).and_return(false) }

      it 'should return the expected tabs' do
        expected_tabs = tabs.push(helper.premium_tab)
        tabs.push(helper.quill_academy_tab)
        expected_tabs.concat(helper.common_authed_user_tabs)
        expect(subject).to eq(expected_tabs)
      end
    end

    context 'when current_user is a teacher premium user' do
      let(:current_user) { teacher }

      before { allow(teacher).to receive(:should_render_teacher_premium?).and_return(true) }

      it 'should return the expected tabs' do
        expected_tabs = tabs.push(helper.teacher_premium_tab)
        tabs.push(helper.quill_academy_tab)
        expected_tabs.concat(helper.common_authed_user_tabs)
        expect(subject).to eq(expected_tabs)
      end
    end

    context 'when current_user is a non-premium admin user' do
      let(:current_user) { admin }

      before { allow(admin).to receive(:should_render_teacher_premium?).and_return(false) }

      it 'should return the expected tabs' do
        expected_tabs = tabs.concat([helper.premium_tab, helper.premium_hub_tab, helper.quill_academy_tab])
        expected_tabs.concat(helper.common_authed_user_tabs)
        expect(subject).to eq(expected_tabs)
      end
    end

    context 'when current_user is a premium admin user' do
      let(:current_user) { admin }
      let(:subscription) { create(:subscription, account_type: Subscription::SCHOOL_PAID) }

      before { allow(admin).to receive(:should_render_teacher_premium?).and_return(false) }

      it 'should return the expected tabs' do
        create(:user_subscription, user: admin, subscription: subscription)

        expected_tabs = tabs.concat([helper.premium_hub_tab, helper.quill_academy_tab])
        expected_tabs.concat(helper.common_authed_user_tabs)
        expect(subject).to eq(expected_tabs)
      end
    end
  end

  describe '#determine_active_tab' do
    context 'primary navigation' do
      it 'should return "Learning Tools" for relevant paths' do
        expect(helper.determine_active_tab('admins')).to eq(NavigationHelper::SCHOOLS_AND_DISTRICTS)
        expect(helper.determine_active_tab('premium')).to eq(NavigationHelper::SCHOOLS_AND_DISTRICTS)
        expect(helper.determine_active_tab('tools')).to eq(NavigationHelper::LEARNING_TOOLS)
        expect(helper.determine_active_tab('tools/connect')).to eq(NavigationHelper::LEARNING_TOOLS)
        expect(helper.determine_active_tab('about')).to eq(NavigationHelper::ABOUT_US)
        expect(helper.determine_active_tab('announcements')).to eq(NavigationHelper::ABOUT_US)
        expect(helper.determine_active_tab('mission')).to eq(NavigationHelper::ABOUT_US)
        expect(helper.determine_active_tab('impact')).to eq(NavigationHelper::ABOUT_US)
        expect(helper.determine_active_tab('press')).to eq(NavigationHelper::ABOUT_US)
        expect(helper.determine_active_tab('team')).to eq(NavigationHelper::ABOUT_US)
        expect(helper.determine_active_tab('pathways')).to eq(NavigationHelper::ABOUT_US)
        expect(helper.determine_active_tab('careers')).to eq(NavigationHelper::ABOUT_US)
      end

      it 'should return "About Us" for relevant paths' do
        expect(helper.determine_active_tab('about')).to eq(NavigationHelper::ABOUT_US)
        expect(helper.determine_active_tab('announcements')).to eq(NavigationHelper::ABOUT_US)
        expect(helper.determine_active_tab('mission')).to eq(NavigationHelper::ABOUT_US)
        expect(helper.determine_active_tab('impact')).to eq(NavigationHelper::ABOUT_US)
        expect(helper.determine_active_tab('press')).to eq(NavigationHelper::ABOUT_US)
        expect(helper.determine_active_tab('team')).to eq(NavigationHelper::ABOUT_US)
        expect(helper.determine_active_tab('pathways')).to eq(NavigationHelper::ABOUT_US)
        expect(helper.determine_active_tab('careers')).to eq(NavigationHelper::ABOUT_US)
      end

      it 'should return "Explore Curriculum" for relevant paths' do
        expect(helper.determine_active_tab('activities/packs')).to eq(NavigationHelper::EXPLORE_CURRICULUM)
        expect(helper.determine_active_tab('activities/packs/459')).to eq(NavigationHelper::EXPLORE_CURRICULUM)
        expect(helper.determine_active_tab('activities/standard_level/7')).to eq(NavigationHelper::EXPLORE_CURRICULUM)
        expect(helper.determine_active_tab('ap')).to eq(NavigationHelper::EXPLORE_CURRICULUM)
        expect(helper.determine_active_tab('preap')).to eq(NavigationHelper::EXPLORE_CURRICULUM)
        expect(helper.determine_active_tab('springboard')).to eq(NavigationHelper::EXPLORE_CURRICULUM)
      end

      it 'should return "Teacher Center" for relevant paths' do
        expect(helper.determine_active_tab('teacher-center')).to eq(NavigationHelper::TEACHER_CENTER)
        expect(helper.determine_active_tab('faq')).to eq(NavigationHelper::TEACHER_CENTER)
      end

      it 'should return "Student Center" for relevant paths' do
        expect(helper.determine_active_tab('student-center')).to eq(NavigationHelper::STUDENT_CENTER)
      end
    end

    context 'secondary navigation' do
      it 'should return "Overview" for dashboard path' do
        expect(helper.determine_active_tab('teachers/classrooms/dashboard')).to eq(NavigationHelper::OVERVIEW)
      end

      it 'should return "My Account" for relevant paths' do
        expect(helper.determine_active_tab('teachers/my_account')).to eq(NavigationHelper::MY_ACCOUNT)
        expect(helper.determine_active_tab('subscriptions')).to eq(NavigationHelper::MY_ACCOUNT)
        expect(helper.determine_active_tab('admin_access')).to eq(NavigationHelper::MY_ACCOUNT)
      end

      it 'should return "Assign Activities" for assign path' do
        expect(helper.determine_active_tab('assign')).to eq(NavigationHelper::ASSIGN_ACTIVITIES)
      end

      it 'should return "Manage Activities" for relevant paths' do
        expect(helper.determine_active_tab('teachers/classrooms/activity_planner')).to eq(NavigationHelper::MANAGE_ACTIVITIES)
        expect(helper.determine_active_tab('teachers/classrooms/activity_planner/closed')).to eq(NavigationHelper::MANAGE_ACTIVITIES)
        expect(helper.determine_active_tab('teachers/classrooms/activity_planner/lessons')).to eq(NavigationHelper::MANAGE_ACTIVITIES)
      end

      it 'should return "View Reports" for relevant paths' do
        expect(helper.determine_active_tab('teachers/progress_reports/landing_page')).to eq(NavigationHelper::VIEW_REPORTS)
        expect(helper.determine_active_tab('teachers/classrooms/scorebook')).to eq(NavigationHelper::VIEW_REPORTS)
        expect(helper.determine_active_tab('teachers/progress_reports/diagnostic_reports/#/activity_packs')).to eq(NavigationHelper::VIEW_REPORTS)
        expect(helper.determine_active_tab('teachers/progress_reports/diagnostic_reports/#/diagnostics')).to eq(NavigationHelper::VIEW_REPORTS)
        expect(helper.determine_active_tab('teachers/progress_reports/diagnostic_reports/activities_scores_by_classroom')).to eq(NavigationHelper::VIEW_REPORTS)
        expect(helper.determine_active_tab('teachers/progress_reports/diagnostic_reports/concepts/students')).to eq(NavigationHelper::VIEW_REPORTS)
        expect(helper.determine_active_tab('teachers/progress_reports/diagnostic_reports/standards/classrooms')).to eq(NavigationHelper::VIEW_REPORTS)
        expect(helper.determine_active_tab('teachers/progress_reports/activity_sessions')).to eq(NavigationHelper::VIEW_REPORTS)
      end

      it 'should return "Manage Classes" for relevant paths' do
        expect(helper.determine_active_tab('teachers/classrooms')).to eq(NavigationHelper::MANAGE_CLASSES)
        expect(helper.determine_active_tab('teachers/classrooms/archived')).to eq(NavigationHelper::MANAGE_CLASSES)
      end

      it 'should return "Schools & Districts" for teacher_premium and admins path' do
        expect(helper.determine_active_tab('teacher_premium')).to eq(NavigationHelper::SCHOOLS_AND_DISTRICTS)
        expect(helper.determine_active_tab('admins')).to eq(NavigationHelper::SCHOOLS_AND_DISTRICTS)
        expect(helper.determine_active_tab('premium_hub')).to eq(NavigationHelper::SCHOOLS_AND_DISTRICTS)
        expect(helper.determine_active_tab('premium')).to eq(NavigationHelper::SCHOOLS_AND_DISTRICTS)
      end

      it 'should return "Quill Academy" for Quill Academy path' do
        expect(helper.determine_active_tab('quill_academy')).to eq(NavigationHelper::QUILL_ACADEMY)
      end

      it 'should default to "Home" for unmatched paths' do
        expect(helper.determine_active_tab('random-path')).to eq(NavigationHelper::HOME)
      end
    end
  end

  describe '#determine_active_subtab' do
    context 'matched path' do
      it 'should return the expected subtab string' do
        expect(helper.determine_active_subtab('teachers/classrooms/dashboard')).to eq(NavigationHelper::OVERVIEW)
        expect(helper.determine_active_subtab('teachers/my_account')).to eq(NavigationHelper::MY_ACCOUNT)
        expect(helper.determine_active_subtab('subscriptions')).to eq(NavigationHelper::MY_SUBSCRIPTIONS)
        expect(helper.determine_active_subtab('admin_access')).to eq(NavigationHelper::ADMIN_ACCESS)
        expect(helper.determine_active_subtab('teachers/classrooms/archived')).to eq(NavigationHelper::ARCHIVED_CLASSES)
        expect(helper.determine_active_subtab('teachers/classrooms')).to eq(NavigationHelper::ACTIVE_CLASSES)
        expect(helper.determine_active_subtab('teachers/classrooms/scorebook')).to eq(NavigationHelper::ACTIVITY_SUMMARY)
        # see comment in NavigationHelper about the following test
        expect(helper.determine_active_subtab('teachers/progress_reports/diagnostic_reports')).to eq(' ')
        expect(helper.determine_active_subtab('teachers/progress_reports/activities_scores_by_classroom')).to eq(NavigationHelper::ACTIVITY_SCORES)
        expect(helper.determine_active_subtab('teachers/progress_reports/student_overview')).to eq(NavigationHelper::ACTIVITY_SCORES)
        expect(helper.determine_active_subtab('teachers/progress_reports/concepts/students')).to eq(NavigationHelper::CONCEPTS)
        expect(helper.determine_active_subtab('teachers/progress_reports/standards/classrooms')).to eq(NavigationHelper::STANDARDS)
        expect(helper.determine_active_subtab('teachers/progress_reports/activity_sessions')).to eq(NavigationHelper::DATA_EXPORT)
      end
    end

    context 'unmatched path' do
      it 'should return nil and default to the active_tab' do
        expect(helper.determine_active_subtab('random-path')).to eq(nil)
      end
    end
  end

  describe '#determine_premium_class' do
    it 'should return the expected value based on the input path' do
      expect(helper.determine_premium_class('premium_hub')).to eq('red')
      expect(helper.determine_premium_class('quill_academy')).to eq('red')
      expect(helper.determine_premium_class('premium')).to eq('yellow')
      expect(helper.determine_premium_class('random-path')).to eq(nil)
    end
  end

  describe '#show_social_studies_dashboard_tab?' do
    subject { helper.show_social_studies_dashboard_tab?(current_user) }

    context 'when user has unit activities including social studies activities' do
      before do
        allow(helper).to receive(:unit_activities_include_social_studies_activities?).and_return(true)
      end

      let(:current_user) { double(:user, unit_activities_for_classrooms_i_teach: [double(:unit_activity)]) }

      it { is_expected.to eq true }
    end

    context 'when user does not have unit activities including social studies activities' do
      before do
        allow(helper).to receive(:unit_activities_include_social_studies_activities?).and_return(false)
      end

      let(:current_user) { double(:user, unit_activities_for_classrooms_i_teach: [double(:unit_activity)]) }

      it { is_expected.to eq false }
    end

    context 'when user has no unit activities' do
      before do
        allow(helper).to receive(:unit_activities_include_social_studies_activities?).and_return(false)
      end

      let(:current_user) { double(:user, unit_activities_for_classrooms_i_teach: []) }

      it { is_expected.to eq false }
    end
  end

  describe '#show_science_dashboard_tab?' do
    subject { helper.show_science_dashboard_tab?(current_user) }

    before do
      allow(helper).to receive(:unit_activities_include_science_activities?).and_return(helper_result)
    end

    context 'when user has unit activities including social studies activities' do
      let(:helper_result) { true }
      let(:current_user) { double(:user, unit_activities_for_classrooms_i_teach: [double(:unit_activity)]) }

      it { is_expected.to eq true }
    end

    context 'when user does not have unit activities including social studies activities' do
      let(:helper_result) { false }
      let(:current_user) { double(:user, unit_activities_for_classrooms_i_teach: [double(:unit_activity)]) }

      it { is_expected.to eq false }
    end

    context 'when user has no unit activities' do
      let(:helper_result) { false }
      let(:current_user) { double(:user, unit_activities_for_classrooms_i_teach: []) }

      it { is_expected.to eq false }
    end
  end
end
