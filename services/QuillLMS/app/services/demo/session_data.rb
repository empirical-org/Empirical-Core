# frozen_string_literal: true

module Demo
  class SessionData
    FILE_DIRECTORY = Rails.root + 'lib/data/demo'
    ActivitySession = ::ActivitySession

    FILE_ACTIVITY_SESSION = 'activity_sessions.yml'
    FILE_CONCEPT_RESULTS = 'concept_results.yml'
    FILE_CONCEPT_RESULT_QUESTION_TYPES = 'concept_result_question_types.yml'

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

    private def load_file(file)
      YAML.load_file(FILE_DIRECTORY + file)
    end

    # Connect to Prod Follower and run
    def generate_files
      activity_sessions = ACTIVITY_USER_PAIRS.map do |id_pair|
        activity_id, user_id = id_pair

        ActivitySession.unscoped.where(activity_id: activity_id, user_id: user_id, is_final_score: true).first
      end.compact

      write_to_file(activity_sessions, FILE_ACTIVITY_SESSION)

      concept_results = ConceptResult.unscoped.where(activity_session_id: activity_sessions.map(&:id))

      write_to_file(concept_results, FILE_CONCEPT_RESULTS)

      concept_result_question_types = ConceptResultQuestionType.unscoped.where(id: concept_results.map(&:concept_result_question_type_id))

      write_to_file(concept_result_question_types, FILE_CONCEPT_RESULT_QUESTION_TYPES)
    end

    def write_to_file(data, file)
      File.open(FILE_DIRECTORY + file, "w"){ |o| o.write(data.to_yaml)  }
    end
  end
end
