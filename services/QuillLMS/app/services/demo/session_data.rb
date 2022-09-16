# frozen_string_literal: true

module Demo
  class SessionData
    FILE_DIRECTORY = Rails.root + 'lib/data/demo'

    # The parsed yaml files need access to the Models not nested in modules to load properly
    ActivitySession = ::ActivitySession
    ConceptResult = ::ConceptResult
    ConceptResultQuestionType = ::ConceptResultQuestionType

    FILE_ACTIVITY_SESSION = 'activity_sessions.yml'
    FILE_CONCEPT_RESULTS = 'concept_results.yml'
    FILE_CONCEPT_RESULT_QUESTION_TYPES = 'concept_result_question_types.yml'
    FILE_CONCEPT_RESULT_LEGACY_METADATA = 'concept_result_legacy_metadata.yml'

    ACTIVITY_USER_PAIRS = Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES
      .map {|hash| hash[:activity_sessions].map(&:to_a)}
      .flatten(2)
      .push([Demo::ReportDemoCreator::REPLAYED_ACTIVITY_ID, Demo::ReportDemoCreator::REPLAYED_SAMPLE_USER_ID])

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

    private def load_file(file)
      YAML.load_file(FILE_DIRECTORY + file)
    end

    # Connect to Prod Follower and run
    # Demo::SessionData.new.generate_files
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

    def activity_sessions_to_store
      ACTIVITY_USER_PAIRS.map do |id_pair|
        activity_id, user_id = id_pair

        ActivitySession.unscoped.where(activity_id: activity_id, user_id: user_id, is_final_score: true).first
      end.compact
    end

    def write_to_file(data, file)
      File.open(FILE_DIRECTORY + file, "w"){ |o| o.write(data.to_yaml)  }
    end
  end
end
