require_relative '../../config/environment'

class Queries < Thor
  OUTPUT_ADMIN_DIAGNOSTICS = 'lib/query_examples/admin_diagnostics/'

  # user_id 9874030 is a test user
  # e.g. bundle exec thor queries:generate_snapshot_sqls 9874030
  desc 'generate_snapshot_sqls user_id start_time end_time', 'Output .sql fils for all snapshots for a user'
  def generate_snapshot_sqls(user_id, start_time = DEFAULT_START, end_time = DEFAULT_END)
    output_path = OUTPUT_SNAPSHOTS + [user_id, start_time, end_time].join('-')
    output_directory = make_directory(output_path)

    timeframe_start = DateTime.parse(start_time)
    timeframe_end = DateTime.parse(end_time)
    school_ids = school_ids_for_user(user_id)

    snapshot_queries_to_run.each do |key, query|
      sql = query
        .new(**{timeframe_start:,timeframe_end:,school_ids:})
        .query

      puts sql

      metadata = query_metadata(sql)
      puts metadata

      File.write(output_directory + "#{key}.sql", metadata + sql)
    end
  end

  # user_id 9874030 is a test user
  # e.g. bundle exec thor queries:print_snapshot_sql 9874030 'sentences-written'
  desc 'print_snapshot_sql user_id query_key', 'Print the SQL and data usage for a snaphot query to the console'
  def print_snapshot_sql(user_id, query_key, start_time = DEFAULT_START, end_time = DEFAULT_END)

    timeframe_start = DateTime.parse(start_time)
    timeframe_end = DateTime.parse(end_time)
    school_ids = school_ids_for_user(user_id)

    query = snapshot_queries_to_run[query_key]

    sql = query
      .new(**{timeframe_start:,timeframe_end:,school_ids:})
      .query
    metadata = query_metadata(sql)

    puts sql
    puts metadata
  end

  # user_id 9874030 is a test user
  # e.g. bundle exec thor queries:run_all_snapshots --ids=9874030 9700385 3547954 7123848
  option :ids, type: :array, required: true
  desc 'run_all_snapshots', 'Print the SQL and data usage for a snaphot query to the console'
  def run_all_snapshots(start_time = DEFAULT_START, end_time = DEFAULT_END)

    timeframe_start = DateTime.parse(start_time)
    timeframe_end = DateTime.parse(end_time)

    output_file = "#{OUTPUT_SNAPSHOTS}query_results_#{Time.current.to_fs(:number)}.csv"

    CSV.open(output_file, "wb") do |csv|
      csv << (['query'] + options[:ids])
      snapshot_page_queries.each do |key, query|
        row = [key]
        options[:ids].each do |user_id|
          school_ids = school_ids_for_user(user_id)
          result = query.run(**{timeframe_start:,timeframe_end:,school_ids:})
          row.append(parse_result(result))
        end
        csv << row
      end
    end
  end

  # bundle exec thor queries:analyze_diagnostic_queries --dryrun=false
  desc 'analyze_diagnostic_queries --dryrun=true/false', 'Benchmark Google BigQuery queries for comparison'
  method_option :dryrun, type: :boolean, default: true
  def analyze_diagnostic_queries
    dryrun = options[:dryrun]

    multi_queries = {
      'post-diagnostic-completed-view' => ::AdminDiagnosticReports::PostDiagnosticCompletedViewQuery
    }

    single_queries = {
      'diagnostic-skills' => ::AdminDiagnosticReports::DiagnosticPerformanceBySkillQuery,
      # 'diagnostic-skills-view' => ::AdminDiagnosticReports::DiagnosticPerformanceBySkillViewQuery
    }

    student_queries = {
      # 'diagnostic-students-view' => ::AdminDiagnosticReports::DiagnosticPerformanceByStudentViewQuery
    }

    multi_queries2 = {
      'pre-diagnostic-assigned' => ::AdminDiagnosticReports::PreDiagnosticAssignedQuery,
      'pre-diagnostic-completed' => ::AdminDiagnosticReports::PreDiagnosticCompletedQuery,
      'recommendations' => ::AdminDiagnosticReports::DiagnosticRecommendationsQuery,
      'post-diagnostic-assigned' => ::AdminDiagnosticReports::PostDiagnosticAssignedQuery
    }

    timeframe_start = DateTime.parse(DEFAULT_START)
    timeframe_end = DateTime.parse(DEFAULT_END)
    school_ids = [38811,38804,38801,38800,38779,38784,38780,38773,38765,38764]
    aggregation = 'classroom'

    multi_args = {
      timeframe_start:,
      timeframe_end:,
      school_ids:,
      aggregation:
    }
    single_args = multi_args.merge({
      diagnostic_id: 1663 # The starter pre diagnostic
    })
    student_args = single_args.except(:aggregation)

    multi_queries.each {|key, query| run_admin_query(key, query, multi_args, dryrun) }
    single_queries.each {|key, query| run_admin_query(key, query, single_args, dryrun) }
    student_queries.each {|key, query| run_admin_query(key, query, student_args, dryrun) }
    multi_queries2.each {|key, query| run_admin_query(key, query, multi_args, dryrun) }
  end

  # put helper methods in this block
  no_commands do
    OUTPUT_SNAPSHOTS = 'lib/query_examples/snapshots/'

    # Averages run differently (.query raises), so skipping for now
    AVERAGE_SNAPSHOT_QUERIES = [
      'average-active-classrooms-per-teacher',
      'average-activities-completed-per-student',
      'average-active-students-per-classroom'
    ]

    DEFAULT_START = '2023-08-01 00:00:00'
    DEFAULT_END = '2023-11-30 23:59:59'

    private def snapshot_queries
      [
        *::Snapshots::TOPX_QUERY_MAPPING,
        *::Snapshots::COUNT_QUERY_MAPPING,
        *::Snapshots::PREMIUM_REPORTS_QUERY_MAPPING,
        *::Snapshots::PREMIUM_DOWNLOAD_REPORTS_QUERY_MAPPING
      ].to_h
    end

    private def snapshot_queries_to_run
      snapshot_queries.except(*AVERAGE_SNAPSHOT_QUERIES)
    end

    private def snapshot_page_queries
      [*::Snapshots::TOPX_QUERY_MAPPING, *::Snapshots::COUNT_QUERY_MAPPING].to_h
    end

    private def run_admin_query(name, query, args, dryrun)
      output_directory = make_directory(OUTPUT_ADMIN_DIAGNOSTICS)
      sql = query.new(**args).query

      metadata = query_metadata(sql, dryrun:)
      File.write(output_directory + "#{name}.sql", metadata + sql)
    end

    private def parse_result(result)
      if result.is_a?(Array)
        result.map {|h| "#{h[:value]}: #{h[:count]}"}.join(', ')
      elsif result.is_a?(Hash)
        result[:count]
      end
    end

    private def make_directory(path)
      directory = Rails.root + path

      Dir.mkdir(directory) unless Dir.exist?(directory)

      directory
    end

    private def school_ids_for_user(user_id)
      SchoolsAdmins
        .where(user_id: user_id)
        .pluck(:school_id)
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    private def query_metadata(sql, dryrun: true)
      job = Google::Cloud::Bigquery.new.query_job(sql, cache: false, dryrun: dryrun)
      job.wait_until_done!
      stats = job.gapi.statistics

      run_time = stats.end_time.to_i - stats.start_time.to_i

      bytes = stats.total_bytes_processed
      gb_processed = (bytes * 1e-9).round(2)
      total_bytes_billed = stats.query&.total_bytes_billed
      gb_billed = (total_bytes_billed * 1e-9).round(2)
      total_slot_ms = stats.query&.total_slot_ms

      bi_engine_mode = stats.query&.bi_engine_statistics&.acceleration_mode
      bi_engine_code = stats.query&.bi_engine_statistics&.bi_engine_reasons&.first&.code
      bi_engine_message = stats.query&.bi_engine_statistics&.bi_engine_reasons&.first&.message

      <<-STATS
        /*
           Data Processed By Query: #{gb_processed} GB
           Bytes Billed For Query:  #{gb_billed} GB
           Total Query Time:        #{run_time} ms
           Total Slot Time:         #{total_slot_ms} ms
           BI Engine Mode Used:     #{bi_engine_mode}
             BI Engine Code:          #{bi_engine_code}
             BI Engine Message:       #{bi_engine_message}
        */
      STATS
    end
    # rubocop:enable Metrics/CyclomaticComplexity
  end
end
