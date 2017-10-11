class UserMilestone < ActiveRecord::Base
  belongs_to :user
  belongs_to :milestone
  after_create :report_milestone_to_segment

  private

  def report_milestone_to_segment
    ReportMilestoneToSegmentWorker.perform_async(self.user_id, self.milestone.name)
  end


end
