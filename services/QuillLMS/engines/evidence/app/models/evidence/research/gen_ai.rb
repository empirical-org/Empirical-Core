# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      EVAL_API_KEY = ENV['GEN_AI_EXPERIMENT_EVAL_API_KEY']
      EVAL_API_BASE_URI = ENV['GEN_AI_EXPERIMENT_EVAL_API_BASE_URI']

      def self.table_name_prefix
        "evidence_research_gen_ai_"
      end
    end
  end
end
