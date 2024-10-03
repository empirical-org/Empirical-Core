# frozen_string_literal: true

require 'open3'

namespace :local_data do
  desc 'Seed data intended for end-to-end / integration testing'
  task e2e_seed: :environment do
    ActiveRecord::Base.transaction do
      User.find_or_create_by!(email: 'johnnyci@gmail.com') do |u|
        u.name = 'Johnny CI'
        u.role = 'teacher'
        u.password = 'password'
      end
    end
  end

  desc 'truncate local non-user tables'
  task truncate_nonuser_tables: :environment do
    include LocalSeedCommands

    db_config = Rails.configuration.database_configuration['development']['primary']
    ActiveRecord::Base.connection.execute(truncate_command(host: db_config['host']))
  end

  # Note, before running, populate these ENV vars with a 'read-only' user from Heroku:
  # 1) Go to Resources: https://dashboard.heroku.com/apps/empirical-grammar/resources
  # 2) Go to Follower Postgres DB (says "Attached as..", confirm says Primary 'No')
  # 3) Go Credentials -> use 'dan-readonly'
  # Current link (this will change): https://data.heroku.com/datastores/7804c56a-9553-456e-b9e8-b1944d8c3228#credentials
  # PROD_FOLLOWER_DB_NAME
  # PROD_FOLLOWER_DB_HOST
  # PROD_FOLLOWER_DB_USER
  # You will be prompted for the password in the console when run
  # If starting from a new database, run `bundle exec rake db:schema:load` first
  # To Run: bundle exec rake local_data:reset_nonuser_data_from_follower
  desc 'import non-user tables'
  task reset_nonuser_data_from_follower: :environment do
    include LocalSeedCommands
    db_config = Rails.configuration.database_configuration['development']['primary']

    pretty_print('Truncating non-user tables')
    ActiveRecord::Base.connection.execute(truncate_command(host: db_config['host']))

    pretty_print("Downloading data from follower\n(Ignore circular key warning)")
    run_cmd(dump_command)

    database = db_config['database']
    pretty_print("Loading data to #{database}")
    run_cmd(load_command(database: database))

    pretty_print('removing datafile')
    run_cmd(rm_file_command)
  end

  module LocalSeedCommands
    # Get these from Heroku, use a user marked 'read-only'
    # You will be prompted for the password in the console when run
    DB_NAME = ENV['PROD_FOLLOWER_DB_NAME']
    DB_HOST = ENV['PROD_FOLLOWER_DB_HOST']
    DB_USER = ENV['PROD_FOLLOWER_DB_USER']
    FILE_NAME = 'output.sql'

    LINE = '*' * 20

    class NonLocalDBError < StandardError; end

    def run_cmd(command)
      stdout_str, stderr_str, status = Open3.capture3(command)

      return if stderr_str.squish.empty?

      puts "Errors: #{stderr_str}"
    end

    def rm_file_command(file: FILE_NAME)
      "rm #{file}"
    end

    def load_command(database:, file: FILE_NAME)
      "psql -h localhost -p 5432 #{database} -f #{file}"
    end

    def dump_command(tables: NONUSER_TABLES, file: FILE_NAME)
      table_flags = tables.map { |table| "--table=#{table} " }.join(' ')

      "pg_dump -h #{DB_HOST} -p 5432 -U #{DB_USER} -W #{table_flags} --data-only #{DB_NAME} > #{file}"
    end

    def truncate_command(host:, tables: NONUSER_TABLES)
      raise NonLocalDBError if host != 'localhost'

      "TRUNCATE #{tables.compact.join(',')} RESTART IDENTITY CASCADE;"
    end

    def pretty_print(text)
      puts LINE
      puts text
      puts LINE
    end

    # Note this order is purposeful:
    # Tables that other tables have foreign keys to are loaded first
    # Or else they will raise FK errors
    # Then the rest alphabetically
    NONUSER_TABLES = %w[
      standard_categories
      standard_levels
      standards
      content_partners
      raw_scores
      districts
      activities
      skill_groups
      skills
      unit_templates
      concepts
      topics
      comprehension_feedbacks
      comprehension_rules
      activities_unit_templates
      activity_categories
      activity_category_activities
      activity_classifications
      activity_healths
      activity_topics
      announcements
      authors
      blog_posts
      categories
      comprehension_activities
      comprehension_highlights
      comprehension_labels
      comprehension_passages
      comprehension_plagiarism_texts
      comprehension_prompts
      comprehension_prompts_rules
      comprehension_regex_rules
      concept_feedbacks
      concept_result_directions
      concept_result_instructions
      concept_result_previous_feedbacks
      concept_result_prompts
      concept_result_question_types
      content_partner_activities
      criteria
      evidence_hints
      evidence_automl_models
      file_uploads
      firebase_apps
      images
      milestones
      oauth_applications
      objectives
      page_areas
      partner_contents
      plans
      prompt_healths
      questions
      recommendations
      sales_stage_types
      schools
      skill_concepts
      skill_group_activities
      diagnostic_question_skills
      subject_areas
      title_cards
      unit_template_categories
      unit_templates
      zipcode_infos
    ]
  end
end
