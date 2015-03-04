class Unit < ActiveRecord::Base
  include ProgressReportQuery

  belongs_to :classroom
  has_many :classroom_activities, dependent: :destroy
  has_many :activities, through: :classroom_activities
  has_many :topics, through: :activities

  def self.progress_report_select
    "units.id as id, units.name as name"
  end

  # Determine which tables to join against based on the set of
  # filters being applied.
  def self.progress_report_joins(filters)
    # Skip the join against concept_tag_results because
    # otherwise it would affect the retrieval of units for
    # progress reports where concept tags / categories are irrelevant.
    # Could be a LEFT JOIN also.
    if filters[:concept_category_id].present?
      {:classroom_activities => [:classroom, {:activity_sessions => :concept_tag_results, :activity => :topic}]}
    else
      {:classroom_activities => [:activity_sessions, :classroom, {:activity => :topic}]}
    end
  end

  def self.progress_report_group_by
    "units.id"
  end

  def self.progress_report_order_by
    "units.created_at asc, units.name asc" # Try order by creation date, fall back to name
  end
end
