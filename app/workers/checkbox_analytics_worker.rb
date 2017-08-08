class CheckboxAnalyticsWorker
  include Sidekiq::Worker

  def perform(user_id, name)
    user = User.find(user_id)
    analytics = SegmentAnalytics.new
    if report_to_segment?(name)
      constanty_name = name.upcase.gsub(' ', '_')
      analytics.track_event_from_string(constanty_name, user_id)
    end
  end

  def report_to_segment? name
    ['Assign Featured Activity Pack',
     'Assign Quill Diagnostic Activity',
     'Assign Quill Lessons Activity',
     'Assign Quill Connect Activity',
     'Assign Quill Proofreader Activity',
     'Assign Quill Grammar Activity',
     'Complete 10 Activities',
     'Complete 100 Activities',
     'Complete 250 Activities',
     'Complete 500 Activities',
     'Complete 1000 Activities',
     'Start Trial',
     'View Standard Reports',
     'View Concept Reports',
     'Download CSV of Report',
     'Activate Premium',
     'Build Your Own Activity Pack'].include?(name)
  end

end
