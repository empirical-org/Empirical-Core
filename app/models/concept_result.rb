class ConceptResult < ActiveRecord::Base

  belongs_to :concept
  belongs_to :activity_session

  validates :concept, presence: true
  validates :activity_session, presence: true

  # Calculate the average words per minute for all the Typing Speed results
  # def self.average_wpm
  #   joins(:concept_tag)
  #   .where(concept_tags: {name: "Typing Speed"})
  #   .average("cast(metadata->>'wpm' as int)")
  # end

  # # Used as a CTE (common table expression) by other models to get progress report data.
  # def self.correct_results_for_progress_report(teacher, filters)

  #   query = select(<<-SELECT
  #     cast(concept_tag_results.metadata->>'correct' as int) as is_correct,
  #     activity_sessions.user_id,
  #     concept_tag_results.concept_category_id,
  #     concept_tag_results.concept_tag_id
  #   SELECT
  #   ).joins({:activity_session => {:classroom_activity => :classroom}})
  #     .where("activity_sessions.state = ?", "finished")
  #     .where("classrooms.teacher_id = ?", teacher.id) # Always by teacher

  #   if filters[:classroom_id].present?
  #     query = query.where("classrooms.id = ?", filters[:classroom_id])
  #   end

  #   if filters[:student_id].present?
  #     query = query.where("activity_sessions.user_id = ?", filters[:student_id])
  #   end

  #   if filters[:unit_id].present?
  #     query = query.where("classroom_activities.unit_id = ?", filters[:unit_id])
  #   end

  #   if filters[:concept_category_id].present?
  #     query = query.where("concept_tag_results.concept_category_id IN (?)", filters[:concept_category_id])
  #   end

  #   if filters[:concept_tag_id].present?
  #     query = query.where("concept_tag_results.concept_tag_id = ?", filters[:concept_tag_id])
  #   end

  #   query
  # end

  # def self.grammar_counts
  #   select("concept_tags.name, #{correct_result_count_sql} as correct_result_count, #{incorrect_result_count_sql}  as incorrect_result_count")
  #   .joins(:concept_tag => :concept_class)
  #   .where(concept_classes: {name: "Grammar Concepts"})
  #   .group("concept_tags.name")
  #   .order("concept_tags.name asc")
  #   .having("#{correct_result_count_sql} > 0 or #{incorrect_result_count_sql} > 0")
  # end

  # def self.correct_result_count_sql
  #   "SUM(CASE WHEN cast(concept_tag_results.metadata->>'correct' as int) = 1 THEN 1 ELSE 0 END)"
  # end

  # def self.incorrect_result_count_sql
  #   "SUM(CASE WHEN cast(concept_tag_results.metadata->>'correct' as int) = 0 THEN 1 ELSE 0 END)"
  # end

  # def self.total_result_count_sql
  #   "DISTINCT(COUNT(concept_tag_results.id)) as total_result_count"
  # end

  def concept_uid=(concept_uid)
    self.concept = Concept.where(uid: concept_uid).first
  end
end