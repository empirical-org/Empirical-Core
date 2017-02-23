class ProgressReports::Concepts::User
  def self.results(teacher, filters)
    # Include:
    # name of the student
    # correct results count
    # incorrect results count
    # total results count
    # percentage score (correct / total)

    last_name = "substring(users.name, '(?=\s).*')"

    ::User.with(filtered_correct_results: ::ProgressReports::Concepts::ConceptResult.results(teacher, filters))
      .select(<<-SELECT
        users.id,
        users.name,
        COUNT(filtered_correct_results.*) as total_result_count,
        SUM(CASE WHEN filtered_correct_results.is_correct = 1 THEN 1 ELSE 0 END) as correct_result_count,
        SUM(CASE WHEN filtered_correct_results.is_correct = 0 THEN 1 ELSE 0 END) as incorrect_result_count
      SELECT
      ).joins('JOIN filtered_correct_results ON users.id = filtered_correct_results.user_id')
      .group('users.id')
      .order("#{last_name} asc, users.name asc")
  end
end
