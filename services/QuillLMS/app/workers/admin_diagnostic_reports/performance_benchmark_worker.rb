# frozen_string_literal: true

module AdminDiagnosticReports
  class PerformanceBenchmarkWorker
    include Sidekiq::Worker

    def perform
      BenchmarkMailer.benchmark_report(query_performance_by_email).deliver_now!
    end

    private def query_performance_by_email
      school_ids.transform_values do |school_ids|
        multi_query_performance(school_ids)
          .merge(single_query_performance(school_ids))
          .merge(student_query_performance(school_ids))
      end
    end

    private def multi_query_performance(school_ids)
      multi_queries.to_h do |query_name, query|
        start_seconds = DateTime.current.to_f
        query.run(**multi_args(school_ids))
        elapsed_seconds = DateTime.current.to_f - start_seconds
        [query_name, elapsed_seconds]
      end
    end

    private def single_query_performance(school_ids)
      single_queries.to_h do |query_name, query|
        start_seconds = DateTime.current.to_f
        query.run(**single_args(school_ids))
        elapsed_seconds = DateTime.current.to_f - start_seconds
        [query_name, elapsed_seconds]
      end
    end

    private def student_query_performance(school_ids)
      student_queries.to_h do |query_name, query|
        start_seconds = DateTime.current.to_f
        query.run(**student_args(school_ids))
        elapsed_seconds = DateTime.current.to_f - start_seconds
        [query_name, elapsed_seconds]
      end
    end

    private def now = @now ||= DateTime.current
    private def timeframe_start = School.school_year_start(now)
    private def timeframe_end = now

    private def multi_args(school_ids)
      {
        timeframe_start:,
        timeframe_end:,
        school_ids:,
        aggregation: 'grade'
      }
    end

    private def single_args(school_ids)
      multi_args(school_ids).merge({
        diagnostic_id: 1663 # The starter pre diagnostic
      })
    end

    private def student_args(school_ids)
      single_args(school_ids).except(:aggregation)
    end

    private def multi_queries
      {
        'pre-diagnostic-assigned-view' => ::AdminDiagnosticReports::PreDiagnosticAssignedViewQuery,
        'pre-diagnostic-completed-view' => ::AdminDiagnosticReports::PreDiagnosticCompletedViewQuery,
        'recommendations' => ::AdminDiagnosticReports::DiagnosticRecommendationsQuery,
        'post-diagnostic-assigned-view' => ::AdminDiagnosticReports::PostDiagnosticAssignedViewQuery,
        'post-diagnostic-completed-view' => ::AdminDiagnosticReports::PostDiagnosticCompletedViewQuery
      }
    end

    private def single_queries
      {
        'diagnostic-skills-view' => ::AdminDiagnosticReports::DiagnosticPerformanceBySkillViewQuery
      }
    end

    private def student_queries
      {
        'diagnostic-students-view' => ::AdminDiagnosticReports::DiagnosticPerformanceByStudentViewQuery,
        'student-recommendation' => ::AdminDiagnosticReports::DiagnosticRecommendationsByStudentQuery,
        'filter-scope' => ::AdminDiagnosticReports::StudentCountByFilterScopeQuery
      }
    end

    private def school_ids
      {
        'liz.domingue@cpsb.org' => [38811,38804,38801,38800,38779,38784,38780,38773,38765,38764],
        'kclark@stem-prep.org' => [129038, 11117, 129037],
        'freshteachtest@gmail.com' => [71746, 129107]
      }
    end
  end
end
