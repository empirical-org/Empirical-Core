# frozen_string_literal: true

module FooterHelper

  EXCLUDED_FOOTER_PATHS = [
    '/teachers/premium_hub/usage_snapshot_report',
    '/teachers/premium_hub/data_export',
    '/teachers/premium_hub/diagnostic_growth_report'

  ].freeze

  def teacher_dashboard_links
    [
      { href: '/assign', label: 'Assign Activities' },
      { href: '/teachers/classrooms', label: 'My Classes' },
      { href: '/teachers/classrooms/activity_planner', label: 'My Activities' },
      { href: '/teachers/progress_reports/landing_page', label: 'My Reports' }
    ]
  end

  def learning_tools_links
    [
      { href: '/tools/connect', label: 'Quill Connect' },
      { href: '/tools/lessons', label: 'Quill Lessons' },
      { href: '/tools/diagnostic', label: 'Quill Diagnostic' },
      { href: '/tools/proofreader', label: 'Quill Proofreader' },
      { href: '/tools/grammar', label: 'Quill Grammar' },
      { href: '/tools/evidence', label: 'Quill Reading for Evidence' }
    ]
  end

  def explore_activities_links
    [
      { href: '/assign/diagnostic', label: 'Diagnostics' },
      { href: '/assign/activity-type', label: 'Featured Activity Packs' },
      { href: '/assign/activity-library', label: 'Activity Library' },
      { href: '/assign/college-board', label: 'Pre-AP, AP, and Springboard Activities' }
    ]
  end

  def explore_curriculum_links
    [
      { href: '/activities/packs', label: 'Featured Activity Packs' },
      { href: '/ap', label: 'AP Activities' },
      { href: '/preap', label: 'Pre-AP Activities' },
      { href: '/springboard', label: 'SpringBoard Activities' },
      { href: '/activities/section/7', label: 'ELA Standards' }
    ]
  end

  def teacher_center_links
    [
      { href: '/teacher-center', label: 'All Resources' },
      { href: '/teacher-center/topic/whats-new', label: "What's New?" },
      { href: '/teacher-center/topic/writing-for-learning', label: 'Writing For Learning' },
      { href: '/teacher-center/topic/getting_started', label: 'Getting Started' },
      { href: '/teacher-center/topic/video-tutorials', label: 'Video Tutorials' },
      { href: '/teacher-center/topic/best-practices', label: 'Best Practices' },
      { href: '/faq', label: 'FAQ' }
    ]
  end

  def about_us_links
    [
      { href: '/about', label: 'About Us' },
      { href: '/impact', label: 'Impact' },
      { href: '/pathways', label: 'Pathways Initiative' },
      { href: '/team', label: 'Team' },
      { href: '/careers', label: 'Careers' },
      { href: '/press', label: 'Press' },
      { href: '/contact', label: 'Contact Us' }
    ]
  end

  def show_footer?(path)
    !path.in?(EXCLUDED_FOOTER_PATHS)
  end
end
