# frozen_string_literal: true

module Demo
  class SessionData
    DEMO_PATH = 'lib/data/demo'
    FILE_DIRECTORY = Rails.root + DEMO_PATH

    # The parsed yaml files need access to the Models not nested in modules to load properly
    ActivitySession = ::ActivitySession
    ConceptResult = ::ConceptResult
    ConceptResultQuestionType = ::ConceptResultQuestionType

    FILE_ACTIVITY_SESSION = 'activity_sessions.yml'
    FILE_CONCEPT_RESULTS = 'concept_results.yml'
    FILE_CONCEPT_RESULT_QUESTION_TYPES = 'concept_result_question_types.yml'
    FILE_CONCEPT_RESULT_LEGACY_METADATA = 'concept_result_legacy_metadata.yml'
    FILE_ADMIN_DEMO_DATA = 'admin_demo_data.yml'

    SAFE_LOAD_CLASSES = [
      ActiveModel::Attribute.const_get(:FromDatabase),
      Symbol,
      Time,
      ActivitySession,
      ConceptResult,
      ConceptResultQuestionType
    ]

    ACTIVITY_USER_PAIRS = Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES
      .map {|hash| hash[:activity_sessions].map(&:to_a)}
      .flatten(2)

    def activity_sessions
      @activity_sessions ||= load_file(FILE_ACTIVITY_SESSION)
    end

    def concept_results
      @concept_results ||= load_file(FILE_CONCEPT_RESULTS)
    end

    def concept_result_question_types
      @concept_result_question_types ||= load_file(FILE_CONCEPT_RESULT_QUESTION_TYPES)
    end

    def concept_result_legacy_metadata
      @concept_result_legacy_metadata ||= load_file(FILE_CONCEPT_RESULT_LEGACY_METADATA)
    end

    def admin_demo_data
      @admin_demo_data ||= load_file(FILE_ADMIN_DEMO_DATA)
    end

    private def load_file(file)
      file_path = FILE_DIRECTORY + file
      file_content = File.read(file_path)
      YAML.safe_load(file_content, permitted_classes: SAFE_LOAD_CLASSES)
    end

    # Important! This only needs to be run if there is a change to:
    # Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES
    # If that happens:
    # Connect your local app to the prod Follower and run
    # Demo::SessionData.new.generate_files
    # Then commit the generated files to the repo
    def generate_files
      activity_sessions = activity_sessions_to_store

      write_to_file(activity_sessions, FILE_ACTIVITY_SESSION)

      concept_results = ConceptResult.unscoped.where(activity_session_id: activity_sessions.map(&:id))

      write_to_file(concept_results, FILE_CONCEPT_RESULTS)

      concept_result_question_types = ConceptResultQuestionType.unscoped.where(id: concept_results.map(&:concept_result_question_type_id))

      write_to_file(concept_result_question_types, FILE_CONCEPT_RESULT_QUESTION_TYPES)

      # storing a calculated metadata to avoid copying 5 more tables
      concept_result_metadata = concept_results.to_h {|cr| [cr.id, cr.send(:legacy_format_metadata)]}

      write_to_file(concept_result_metadata, FILE_CONCEPT_RESULT_LEGACY_METADATA)
    end

    private def activity_sessions_to_store
      ACTIVITY_USER_PAIRS.map do |id_pair|
        activity_id, user_id = id_pair

        # we only want to find the first one if it's a diagnostic because there should be no replays
        if Activity.diagnostic_activity_ids.include?(activity_id)
          ActivitySession.unscoped.find_by(activity_id: activity_id, user_id: user_id)
        else
          ActivitySession.unscoped.where(activity_id: activity_id, user_id: user_id)
        end
      end.flatten.compact
    end

    private def write_to_file(data, file)
      File.write(FILE_DIRECTORY + file, data.to_yaml)
    end
  end
end
