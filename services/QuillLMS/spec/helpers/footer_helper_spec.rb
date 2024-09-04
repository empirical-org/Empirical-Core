# frozen_string_literal: true

require 'rails_helper'

describe FooterHelper do
  describe '#schools_and_districts_links' do
    let(:schools_and_districts_links) {
      [
        { href: '/admins', label: 'For Administrators' },
        { href: '/premium', label: 'Premium Pricing' },
      ]
    }

    it 'should return the expected values' do
      expect(helper.schools_and_districts_links).to eq schools_and_districts_links
    end
  end

  describe '#learning_tools_links' do
    let(:learning_tools_links) {
      [
        { href: '/tools/connect', label: 'Quill Connect' },
        { href: '/tools/lessons', label: 'Quill Lessons' },
        { href: '/tools/diagnostic', label: 'Quill Diagnostic' },
        { href: '/tools/proofreader', label: 'Quill Proofreader' },
        { href: '/tools/grammar', label: 'Quill Grammar' },
        { href: '/tools/evidence', label: 'Quill Reading for Evidence' }
      ]
    }

    it 'should return the expected values' do
      expect(helper.learning_tools_links).to eq learning_tools_links
    end
  end

  describe '#explore_activities_links' do
    let(:explore_activities_links) {
      [
        { href: '/assign/diagnostic', label: 'Diagnostics' },
        { href: '/assign/activity-type', label: 'Featured Activity Packs' },
        { href: '/assign/activity-library', label: 'Activity Library' },
        { href: '/assign/college-board', label: 'Pre-AP, AP, and Springboard Activities' }
      ]
    }

    it 'should return the expected values' do
      expect(helper.explore_activities_links).to eq explore_activities_links
    end
  end

  describe '#explore_curriculum_links' do
    let(:explore_curriculum_links) {
      [
        { href: '/activities/packs', label: 'Featured Activity Packs' },
        { href: '/ap', label: 'AP Activities' },
        { href: '/preap', label: 'Pre-AP Activities' },
        { href: '/springboard', label: 'SpringBoard Activities' },
        { href: '/activities/section/7', label: 'ELA Standards' }
      ]
    }

    it 'should return the expected values' do
      expect(helper.explore_curriculum_links).to eq explore_curriculum_links
    end
  end

  describe '#teacher_center_links' do
    let(:teacher_center_links) {
      [
        { href: '/teacher-center', label: 'All Resources' },
        { href: '/teacher-center/topic/whats-new', label: "What's New?" },
        { href: '/teacher-center/topic/writing-for-learning', label: 'Writing For Learning' },
        { href: '/teacher-center/topic/getting_started', label: 'Getting Started' },
        { href: '/teacher-center/topic/video-tutorials', label: 'Video Tutorials' },
        { href: '/teacher-center/topic/best-practices', label: 'Best Practices' },
        { href: '/faq', label: 'FAQ' }
      ]
    }

    it 'should return the expected values' do
      expect(helper.teacher_center_links).to eq teacher_center_links
    end
  end

  describe '#about_us_links' do
    let(:about_us_links) {
      [
        { href: '/about', label: 'About Us' },
        { href: '/impact', label: 'Impact' },
        { href: '/pathways', label: 'Pathways Initiative' },
        { href: '/team', label: 'Team' },
        { href: '/careers', label: 'Careers' },
        { href: '/press', label: 'Press' },
        { href: '/contact', label: 'Contact Us' }
      ]
    }

    it 'should return the expected values' do
      expect(helper.about_us_links).to eq about_us_links
    end
  end
end
