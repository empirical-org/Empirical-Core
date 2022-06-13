# frozen_string_literal: true

require 'rails_helper'

describe TeacherCenterHelper do
  describe '#teacher_center_tabs' do
    let(:current_user) { create(:teacher) }
    let(:app_setting) { create(:app_setting, name: "comprehension") }
    let(:tabs) {
      [
        { id: "All resources", name: "All", url: "teacher-center" },
        { id: "Getting started", name: "Getting started", url: "teacher-center/topic/getting-started" },
        { id: "Best practices", name: "Best practices", url: "teacher-center/topic/best-practices" },
        { id: "Writing instruction research", name: "Research", url: "teacher-center/topic/writing-instruction-research" },
        { id: "FAQ", name: "FAQ", url: "faq" }
      ]
    }

    before do
      allow(helper).to receive(:current_user) { current_user }
    end

    it 'should return the tabs without comprehension if app setting is false' do
      create(:app_setting, name: "comprehension")
      expect(helper.teacher_center_tabs).to eq tabs
    end

    it 'should return the tabs with comprehension if app setting is true' do
      comprehension_tab = { id: "Using quill for reading comprehension", name: "Reading comprehension", url: "teacher-center/topic/using-quill-for-reading-comprehension" }
      app_setting.enabled = true
      app_setting.user_ids_allow_list = [current_user.id]
      app_setting.save!
      tabs.insert(1, comprehension_tab)
      expect(helper.teacher_center_tabs).to eq tabs
    end
  end

  describe '#teacher_center_tabs when not signed in' do
    let(:tabs) {
      [
        { id: "All resources", name: "All", url: "teacher-center" },
        { id: "Getting started", name: "Getting started", url: "teacher-center/topic/getting-started" },
        { id: "Best practices", name: "Best practices", url: "teacher-center/topic/best-practices" },
        { id: "Writing instruction research", name: "Research", url: "teacher-center/topic/writing-instruction-research" },
        { id: "FAQ", name: "FAQ", url: "faq" },
        { id: "Premium", name: "Premium", url: "premium"}
      ]
    }

    before do
      allow(helper).to receive(:current_user) { nil }
    end

    it 'should return the tabs with premium tab if current user is nil' do
      create(:app_setting, name: "comprehension")
      expect(helper.teacher_center_tabs).to eq tabs
    end
  end

  describe `#explore_curriculum_tabs` do
    let(:large_tabs) {
      [
        {name: 'Featured Activities', url: 'activities/packs'},
        {name: 'AP Activities', url: 'ap'},
        {name: 'Pre-AP Activities', url: 'preap'},
        {name: 'SpringBoard Activities', url: 'springboard'},
        {name: 'ELA Standards', url: 'activities/standard_level/7'}
      ]
    }
    let(:small_tabs) {
      [
        {name: 'Featured', url: 'activities/packs'},
        {name: 'AP', url: 'ap'},
        {name: 'Pre-AP', url: 'preap'},
        {name: 'SpringBoard', url: 'springboard'},
        {name: 'Standards', url: 'activities/standard_level/7'}
      ]
    }

    it 'should return large_tabs if large is true' do
      expect(helper.explore_curriculum_tabs(large: true)).to eq large_tabs
    end

    it 'should return small_tabs if large is false' do
      expect(helper.explore_curriculum_tabs(large: false)).to eq small_tabs
    end
  end
end
