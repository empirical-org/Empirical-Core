class ConceptCategory < ActiveRecord::Base
  include ProgressReportQuery
  belongs_to :concept_class

  has_many :concept_tag_results

  def self.progress_report_select
    <<-SELECT
      concept_categories.id as concept_category_id,
      concept_categories.name as concept_category_name,
      COUNT(concept_tag_results.id) as total_result_count,
      SUM(CASE WHEN cast(concept_tag_results.metadata->>'correct' as int) = 1 THEN 1 ELSE 0 END) as correct_result_count,
      SUM(CASE WHEN cast(concept_tag_results.metadata->>'correct' as int) = 1 THEN 0 ELSE 1 END) as incorrect_result_count
    SELECT
  end

  def self.progress_report_joins(filters)
    {:concept_tag_results => {:activity_session => {:classroom_activity => :classroom}}}
  end

  def self.progress_report_group_by
    "concept_categories.id"
  end

  def self.progress_report_order_by
    "concept_category_name asc"
  end

  def self.for_tags_report(teacher, concept_category_id)
    for_progress_report(teacher, {concept_category_id: concept_category_id}).first
    # This part is janky
    # query = progress_report_base_query(teacher, {}).where('concept_category_id = ?', concept_category_id)
    # get_query_results(query).first
  end
end