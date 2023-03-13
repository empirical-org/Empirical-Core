# frozen_string_literal: true

require 'rails_helper'

describe TeacherCenterHelper do
  describe '#teacher_center_tabs' do
    let(:current_user) { create(:teacher) }
    let(:app_setting) { create(:app_setting, name: "comprehension") }
    let(:tabs) {
      [
        { id: "All resources", name: "All", url: "/teacher-center" },
        { id: BlogPost::WHATS_NEW, name: BlogPost::WHATS_NEW, url: "/teacher-center/topic/whats-new" },
        { id: BlogPost::USING_QUILL_FOR_READING_COMPREHENSION, name: "Reading comprehension", url: "/teacher-center/topic/using-quill-for-reading-comprehension" },
        { id: BlogPost::GETTING_STARTED, name: BlogPost::GETTING_STARTED, url: "/teacher-center/topic/getting-started" },
        { id: BlogPost::BEST_PRACTICES, name: BlogPost::BEST_PRACTICES, url: "/teacher-center/topic/best-practices" },
        { id: BlogPost::WRITING_INSTRUCTION_RESEARCH, name: "Research", url: "/teacher-center/topic/writing-instruction-research" },
        { id: TeacherCenterHelper::FAQ, name: TeacherCenterHelper::FAQ, url: "/faq" },
        { id: BlogPost::WEBINARS, name: BlogPost::WEBINARS, url: "/teacher-center/topic/webinars" },
        { id: BlogPost::TEACHER_MATERIALS, name: BlogPost::TEACHER_MATERIALS, url: "/teacher-center/topic/teacher-materials" },
        { id: BlogPost::TEACHER_STORIES, name: BlogPost::TEACHER_STORIES, url: "/teacher-center/topic/teacher-stories" }
      ]
    }

    it 'should return the expected tabs' do
      expect(helper.teacher_center_tabs).to eq tabs
    end
  end

  describe `#explore_curriculum_tabs` do
    let(:large_tabs) {
      [
        {id: 'Featured Activities', name: 'Featured Activities', url: '/activities/packs'},
        {id: 'AP Activities', name: 'AP Activities', url: '/ap'},
        {id: 'Pre-AP Activities', name: 'Pre-AP Activities', url: '/preap'},
        {id: 'SpringBoard Activities', name: 'SpringBoard Activities', url: '/springboard'},
        {id: 'ELA Standards', name: 'ELA Standards', url: '/activities/standard_level/7'}
      ]
    }
    let(:small_tabs) {
      [
        {id: 'Featured Activities', name: 'Featured', url: '/activities/packs'},
        {id: 'AP Activities', name: 'AP', url: '/ap'},
        {id: 'Pre-AP Activities', name: 'Pre-AP', url: '/preap'},
        {id: 'SpringBoard Activities', name: 'SpringBoard', url: '/springboard'},
        {id: 'ELA Standards', name: 'Standards', url: '/activities/standard_level/7'}
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
