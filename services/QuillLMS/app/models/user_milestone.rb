class UserMilestone < ActiveRecord::Base
  belongs_to :user
  belongs_to :milestone
  after_commit :report_milestone_to_segment

  private

  def report_milestone_to_segment
    ::ReportMilestoneToSegmentWorker.perform_async(user_id, milestone.name)
  end


end
