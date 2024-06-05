# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class TrialsController < ApplicationController
        include TrialsHelper

        def index
          completed_trials =
            Trial
              .completed
              .pluck(:llm_id, :llm_prompt_id, :passage_prompt_id, :num_examples)
              .map { |llm_id, llm_prompt_id, passage_prompt_id, num_examples| { llm_id:, llm_prompt_id:, passage_prompt_id:, num_examples: } }
              .to_set

          @trials = Trial.all.reject do |trial|
            trial.failed? && completed_trials.include?(
              llm_id: trial.llm_id,
              llm_prompt_id: trial.llm_prompt_id,
              passage_prompt_id: trial.passage_prompt_id,
              num_examples: trial.num_examples
            )
          end.sort_by(&:id).reverse
        end

        def new
          @trial = Trial.new
          @llms = LLM.all
          @passage_prompts = PassagePrompt.all
          @llm_prompt_templates = LLMPromptTemplate.all
          @g_evals = GEval.selectable
        end

        def create
          llm_ids.each do |llm_id|
            llm_prompt_template_ids.each do |llm_prompt_template_id|
              passage_prompt_ids.each do |passage_prompt_id|
                llm_prompt = LLMPrompt.create_from_template!(llm_prompt_template_id:, passage_prompt_id:)

                run_trial(
                  llm_id:,
                  llm_prompt_id: llm_prompt.id,
                  passage_prompt_id:,
                  num_examples: num_examples(passage_prompt_id)
                )
              end
            end
          end

          redirect_to research_gen_ai_trials_path
        end

        def show
          @trial = Trial.find(params[:id])
          @histogram = @trial.api_call_times.map(&:round).tally if @trial.api_call_times.present?
          @next = Trial.where("id > ?", @trial.id).order(id: :asc).first
          @previous = Trial.where("id < ?", @trial.id).order(id: :desc).first
          @g_evals = GEval.where(id: @trial.g_eval_ids).order(:id)
        end

        def retry
          run_trial(**Trial.find(params[:id]).retry_params)

          redirect_to research_gen_ai_trials_path
        end

        private def run_trial(llm_id:, llm_prompt_id:, passage_prompt_id:, num_examples:)
          trial = Trial.new(llm_id:, passage_prompt_id:, llm_prompt_id:, num_examples:)
          trial.results = { g_eval_ids: }

          RunTrialWorker.perform_async(trial.id) if trial.save
        end

        private def trial_params
          params
            .require(:research_gen_ai_trial)
            .permit(
              :num_examples,
              llm_ids: [],
              llm_prompt_template_ids: [],
              passage_prompt_ids: [],
              g_eval_ids: []
            )
        end

        private def llm_ids = trial_params[:llm_ids].reject(&:blank?).map(&:to_i)
        private def llm_prompt_template_ids = trial_params[:llm_prompt_template_ids].reject(&:blank?).map(&:to_i)
        private def passage_prompt_ids = trial_params[:passage_prompt_ids].reject(&:blank?).map(&:to_i)
        private def g_eval_ids = trial_params[:g_eval_ids]&.reject(&:blank?)&.map(&:to_i)&.sort || []

        private def num_examples(passage_prompt_id)
          max_num_examples = PassagePrompt.find(passage_prompt_id).student_responses.testing_data.count

          return max_num_examples if trial_params[:num_examples].blank?

          [max_num_examples, trial_params[:num_examples].to_i].min
        end
      end
    end
  end
end
