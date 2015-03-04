class ConceptTag < ActiveRecord::Base
  belongs_to :concept_class
  has_many :concept_tag_results

  def self.for_progress_report(teacher, filters)
    query = select(<<-SELECT
      concept_tags.id as concept_tag_id,
      concept_tags.name as concept_tag_name,
      COUNT(concept_tag_results.id) as total_result_count,
      SUM(CASE WHEN cast(concept_tag_results.metadata->>'correct' as int) = 1 THEN 1 ELSE 0 END) as correct_result_count,
      SUM(CASE WHEN cast(concept_tag_results.metadata->>'correct' as int) = 1 THEN 0 ELSE 1 END) as incorrect_result_count
    SELECT
    ).joins(:concept_tag_results => {:activity_session => {:classroom_activity => :classroom}})
      .group("concept_tags.id")
      .where("concept_tag_results.concept_category_id = ?", filters[:concept_category_id])
      .where("activity_sessions.state = ?", "finished")
      .where("classrooms.teacher_id = ?", teacher.id) # Filter based on teacher ID

    # if filters[:classroom_id].present?
    #   query = query.where("classrooms.id = ?", filters[:classroom_id])
    # end

    # if filters[:student_id].present?
    #   query = query.where("activity_sessions.user_id = ?", filters[:student_id])
    # end

    # if filters[:unit_id].present?
    #   query = query.where("classroom_activities.unit_id = ?", filters[:unit_id])
    # end

    results = ActiveRecord::Base.connection.select_all(query)
    results.to_hash
  end

end