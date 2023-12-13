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
  EXCLUDED_SNAPSHOT_QUERIES = [
    'average-active-classrooms-per-teacher',
    'average-activities-completed-per-student',
    'average-active-students-per-classroom'
  ]

  SNAPSHOT_QUERIES_TO_RUN = SNAPSHOT_QUERIES.except(*EXCLUDED_SNAPSHOT_QUERIES)

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

  # put helper methods in this block
  no_commands do
    private def make_directory(path)
      directory = Rails.root + path

      Dir.mkdir(directory) unless Dir.exists?(directory)

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
      /* Data Process By Query: #{gb_processed} GB */

      STRING
    end
  end
end
