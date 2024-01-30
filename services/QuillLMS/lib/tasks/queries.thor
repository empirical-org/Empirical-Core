require_relative '../../config/environment'

class Queries < Thor
  OUTPUT_SNAPSHOTS = 'lib/query_examples/snapshots/'
  SNAPSHOT_QUERIES = [
    *::Snapshots::TOPX_QUERY_MAPPING,
    *::Snapshots::COUNT_QUERY_MAPPING,
    *::Snapshots::PREMIUM_REPORTS_QUERY_MAPPING,
    *::Snapshots::PREMIUM_DOWNLOAD_REPORTS_QUERY_MAPPING
  ].to_h

  # Averages run differently (.query raises), so skipping for now
  AVERAGE_SNAPSHOT_QUERIES = [
    'average-active-classrooms-per-teacher',
    'average-activities-completed-per-student',
    'average-active-students-per-classroom'
  ]


  SNAPSHOT_QUERIES_TO_RUN = SNAPSHOT_QUERIES.except(*AVERAGE_SNAPSHOT_QUERIES)
  SNAPSHOT_PAGE_QUERIES = [*::Snapshots::TOPX_QUERY_MAPPING, *::Snapshots::COUNT_QUERY_MAPPING].to_h

  DEFAULT_START = '2023-08-01'
  DEFAULT_END = '2023-12-01'

  # user_id 9874030 is a test user
  # e.g. bundle exec thor queries:generate_snapshot_sqls 9874030
  desc 'generate_snapshot_sqls user_id start_time end_time', 'Output .sql fils for all snapshots for a user'
  def generate_snapshot_sqls(user_id, start_time = DEFAULT_START, end_time = DEFAULT_END)
    output_path = OUTPUT_SNAPSHOTS + [user_id, start_time, end_time].join('-')
    output_directory = make_directory(output_path)

    timeframe_start = DateTime.parse(start_time)
    timeframe_end = DateTime.parse(end_time)
    school_ids = school_ids_for_user(user_id)

    SNAPSHOT_QUERIES_TO_RUN.each do |key, query|
      sql = query
        .new(**{timeframe_start:,timeframe_end:,school_ids:})
        .query
      metadata = query_metadata(sql)


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

    query = SNAPSHOT_QUERIES_TO_RUN[query_key]

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
      SNAPSHOT_PAGE_QUERIES.each do |key, query|
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

  # put helper methods in this block
  no_commands do
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

    private def query_metadata(sql)
      job = Google::Cloud::Bigquery.new.query_job(sql, dryrun: true)
      bytes = job.gapi.statistics.total_bytes_processed
      gb_processed = (bytes * 1e-9).round(2)

      <<-STRING
      /* Data Processed By Query: #{gb_processed} GB */

      STRING
    end
  end
end
