# frozen_string_literal: true

class ProgressReports::Concepts::User
  def self.results(teacher, filters)
    last_name = "substring(users.name, '(?=\s).*')"
    filtered_correct_results_query = ProgressReports::Concepts::ConceptResult.results(teacher, filters).to_sql
    filtered_correct_results = "( #{filtered_correct_results_query} ) AS filtered_correct_results"

    ::User
      .select(
        <<-SQL
          users.id,
          users.name,
          COUNT(filtered_correct_results.*) AS total_result_count,
          SUM(CASE WHEN filtered_correct_results.is_correct = 1 THEN 1 ELSE 0 END) AS correct_result_count,
          SUM(CASE WHEN filtered_correct_results.is_correct = 0 THEN 1 ELSE 0 END) AS incorrect_result_count
        SQL
      )
      .joins("JOIN #{filtered_correct_results} ON users.id = filtered_correct_results.user_id")
      .group('users.id')
      .order(Arel.sql("#{last_name} ASC, users.name ASC"))
  end
end
