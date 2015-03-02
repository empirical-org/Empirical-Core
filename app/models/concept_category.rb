class ConceptCategory < ActiveRecord::Base
  belongs_to :concept_class

  has_many :concept_tag_results

  def self.for_progress_report(teacher)
    query = select(<<-SELECT
      concept_categories.id as concept_category_id,
      concept_categories.name as concept_category_name,
      COUNT(concept_tag_results.id) as total_result_count,
      SUM(CASE WHEN cast(concept_tag_results.metadata->>'correct' as int) = 1 THEN 1 ELSE 0 END) as correct_result_count,
      SUM(CASE WHEN cast(concept_tag_results.metadata->>'correct' as int) = 1 THEN 0 ELSE 1 END) as incorrect_result_count
    SELECT
    ).joins(:concept_tag_results => {:activity_session => {:classroom_activity => :classroom}})
      .group("concept_categories.id")
      .where("activity_sessions.state = ?", "finished")
      .where("classrooms.teacher_id = ?", teacher.id) # Filter based on teacher ID

    results = ActiveRecord::Base.connection.select_all(query)
    results.to_hash
  end
end