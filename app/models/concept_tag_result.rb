class ConceptTagResult < ActiveRecord::Base

  belongs_to :concept_tag
  belongs_to :activity_session
  belongs_to :concept_category

  before_validation :extract_tag_from_metadata, on: :create

  validates :concept_tag, presence: true
  validates :concept_category, presence: true

  # Calculate the average words per minute for all the Typing Speed results
  def self.average_wpm
    joins(:concept_tag)
    .where(concept_tags: {name: "Typing Speed"})
    .average("cast(metadata->>'wpm' as int)")
  end

  # Used as a CTE (common table expression) by other models to get progress report data.
  def self.correct_results_for_progress_report(teacher, filters)

    query = select(<<-SELECT
      cast(concept_tag_results.metadata->>'correct' as int) as is_correct,
      activity_sessions.user_id,
      concept_tag_results.concept_category_id,
      concept_tag_results.concept_tag_id
    SELECT
    ).joins({:activity_session => {:classroom_activity => :classroom}})
      .where("activity_sessions.state = ?", "finished")
      .where("classrooms.teacher_id = ?", teacher.id) # Always by teacher

    if filters[:classroom_id].present?
      query = query.where("classrooms.id = ?", filters[:classroom_id])
    end

    if filters[:student_id].present?
      query = query.where("activity_sessions.user_id = ?", filters[:student_id])
    end

    if filters[:unit_id].present?
      query = query.where("classroom_activities.unit_id = ?", filters[:unit_id])
    end

    if filters[:concept_category_id].present?
      query = query.where("concept_tag_results.concept_category_id IN (?)", filters[:concept_category_id])
    end

    if filters[:concept_tag_id].present?
      query = query.where("concept_tag_results.concept_tag_id = ?", filters[:concept_tag_id])
    end

    query
  end

  def self.grammar_counts
    select("concept_tags.name, #{correct_result_count_sql} as correct_result_count, #{incorrect_result_count_sql}  as incorrect_result_count")
    .joins(:concept_tag => :concept_class)
    .where(concept_classes: {name: "Grammar Concepts"})
    .group("concept_tags.name")
    .order("concept_tags.name asc")
    .having("#{correct_result_count_sql} > 0 or #{incorrect_result_count_sql} > 0")
  end

  def self.correct_result_count_sql
    "SUM(CASE WHEN cast(concept_tag_results.metadata->>'correct' as int) = 1 THEN 1 ELSE 0 END)"
  end

  def self.incorrect_result_count_sql
    "SUM(CASE WHEN cast(concept_tag_results.metadata->>'correct' as int) = 0 THEN 1 ELSE 0 END)"
  end

  def self.total_result_count_sql
    "DISTINCT(COUNT(concept_tag_results.id)) as total_result_count"
  end

  private

  def extract_tag_from_metadata
    return unless metadata.present?
    tag_name = metadata.delete("concept_tag") # Can't use symbols because it's a JSON hash
    if tag_name.present?
      concept_class_name = metadata.delete("concept_class")
      concept_category_name = metadata.delete("concept_category")
      self.concept_category = ConceptCategory.joins(:concept_class)
        .where(name: concept_category_name, concept_classes: {name: concept_class_name})
        .first
      self.concept_tag = ConceptTag.joins(:concept_class)
        .where(name: tag_name, concept_classes: {name: concept_class_name})
        .first
    end
  end
end