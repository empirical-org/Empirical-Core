# frozen_string_literal: true

namespace :ell_post_tests do
  desc 'Update ELL diagnostics and associated data in preparation for ELL post-tests'
  task :setup => :environment do
    ell_starter_pre = Activity.find(1161)
    ell_intermediate_pre = Activity.find(1568)
    ell_advanced_pre = Activity.find(1590)
    ell_starter_post = Activity.find(1774)
    ell_intermediate_post = Activity.find(1814)
    ell_advanced_post = Activity.find(1818)

    ell_starter_pre.follow_up_activity = ell_starter_post
    ell_intermediate_pre.follow_up_activity = ell_intermediate_post
    ell_advanced_pre.follow_up_activity = ell_advanced_post

    ell_starter_pre.update(name: 'ELL Starter Baseline Diagnostic (Pre)', flag: 'production')
    ell_intermediate_pre.update(name: 'ELL Intermediate Baseline Diagnostic (Pre)', flag: 'production')
    ell_advanced_pre.update(name: 'ELL Advanced Baseline Diagnostic (Pre)', flag: 'production')

    ell_starter_post.update(name: 'ELL Starter Growth Diagnostic (Post)', flag: 'private')
    ell_intermediate_post.update(name: 'ELL Intermediate Growth Diagnostic (Post)', flag: 'private')
    ell_advanced_post.update(name: 'ELL Advanced Growth Diagnostic (Post)', flag: 'private')

    [ell_starter_pre, ell_intermediate_pre, ell_advanced_pre, ell_starter_post, ell_intermediate_post, ell_advanced_post].each { |act| update_data_hashes(act) }

    [ell_starter_pre, ell_intermediate_pre, ell_advanced_pre].each do |act|
      act.follow_up_activity.skill_groups = act.skill_groups
    end
  end

  def update_data_hashes(activity)
    activity.data['name'] = activity.name
    activity.data['flag'] = 'production' # there is no private flag in the activity cms
    if activity.data['landingPageHtml'] == "<br/>"
      activity.data['landingPageHtml'] = "<p> </p>"
    end
    activity.save
  end
end
