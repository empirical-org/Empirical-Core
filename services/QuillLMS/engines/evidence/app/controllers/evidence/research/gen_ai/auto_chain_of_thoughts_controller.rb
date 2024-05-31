# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class AutoChainOfThoughtsController < ApplicationController
        EVALUATION_STEPS_JSON_FORMAT = { steps: ['Step 1', 'Step 2', 'Step 3'] }.to_json

        def create
          redirect_to new_research_gen_ai_g_eval_path(
            research_gen_ai_g_eval: { metric:, task_introduction:, evaluation_criteria:, evaluation_steps: }
          )
        end

        private def task_introduction = params[:task_introduction]

        private def evaluation_criteria = params[:evaluation_criteria]

        private def metric = params[:metric]

        private def evaluation_steps
          JSON
            .parse(llm_response)['steps']
            .join("\n")
            .strip
        end

        private def llm_response = LLMConfig.auto_cot.completion(prompt:)

        private def prompt
          "
            Based on the following task: #{task_introduction}

            Please generate evaluation steps for the following evaluation criteria.
            #{evaluation_criteria}

            There should be 3-4 steps outlining how to evaluate #{metric}.

            Please give the output in the following JSON format: #{EVALUATION_STEPS_JSON_FORMAT}
          "
        end
      end
    end
  end
end
