class ConceptTag < ActiveRecord::Base
  include ProgressReportQuery

  belongs_to :concept_class
  has_many :concept_tag_results

  def self.progress_report_select
    <<-SELECT
      concept_tags.id as concept_tag_id,
      concept_tags.name as concept_tag_name,
      COUNT(concept_tag_results.id) as total_result_count,
      #{ConceptTagResult.correct_result_count_sql},
      #{ConceptTagResult.incorrect_result_count_sql}
    SELECT
  end

  def self.progress_report_joins(filters)
    {:concept_tag_results => {:activity_session => {:classroom_activity => :classroom}}}
  end

  def self.progress_report_order_by
    "concept_tags.name asc"
  end

  def self.progress_report_group_by
    "concept_tags.id"
  end
end