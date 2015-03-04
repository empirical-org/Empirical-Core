class Unit < ActiveRecord::Base
  include ProgressReportQuery

  belongs_to :classroom
  has_many :classroom_activities, dependent: :destroy
  has_many :activities, through: :classroom_activities
  has_many :topics, through: :activities

  def self.progress_report_select
    "units.id as id, units.name as name"
  end

  def self.progress_report_joins
    {:classroom_activities => [:activity_sessions, :classroom, {:activity => :topic}]}
  end

  def self.progress_report_group_by
    "units.id"
  end

  def self.progress_report_order_by
    "units.created_at asc, units.name asc" # Try order by creation date, fall back to name
  end
end
