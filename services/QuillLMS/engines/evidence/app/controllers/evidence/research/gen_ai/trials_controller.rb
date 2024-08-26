# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class TrialsController < ApplicationController
        include TrialsHelper

        def new
          @trial = dataset.trials.new
          @llms = LLM.order(:order)
          @llm_prompt_templates = LLMPromptTemplate.all
          @g_evals = GEval.selectable
          @optimal_guidelines = dataset.stem_vault.guidelines.optimal.visible
          @suboptimal_guidelines = dataset.stem_vault.guidelines.suboptimal.visible
          @prompt_examples = dataset.prompt_examples
        end

        def create
          llm_prompt = LLMPrompt.create_from_template!(dataset_id:, guideline_ids:, llm_prompt_template_id:, prompt_example_ids:)

          trial = dataset.trials.new(llm_id:, llm_prompt:)
          trial.results = { g_eval_ids: [g_eval_id] }

          if trial.save
            RunTrialWorker.perform_async(trial.id)
            redirect_to research_gen_ai_dataset_trial_path(dataset_id: @dataset.id, id: trial.id)
          else
            render :new
          end
        end

        def show
          @trial = dataset.trials.find(params[:id])
          @histogram = @trial.api_call_times.map(&:round).tally if @trial.api_call_times.present?
          @next = Trial.where('id > ?', @trial.id).order(id: :asc).first
          @previous = Trial.where('id < ?', @trial.id).order(id: :desc).first
          @g_evals = GEval.where(id: @trial.g_eval_ids)
        end

        def retry
          run_trial(**Trial.find(params[:id]).retry_params)

          redirect_to research_gen_ai_dataset_trials_path(dataset_id:)
        end

        private def dataset = @dataset ||= Dataset.find(dataset_id)

        private def dataset_id = params[:dataset_id]
        private def g_eval_id = trial_params[:g_eval_id]
        private def guideline_ids = trial_params[:guideline_ids]&.reject(&:blank?)&.map(&:to_i) || []
        private def llm_id = trial_params[:llm_id]
        private def llm_prompt_template_id = trial_params[:llm_prompt_template_id]
        private def prompt_example_ids = trial_params[:prompt_example_ids]&.reject(&:blank?)&.map(&:to_i) || []

        private def trial_params
          params
            .require(:research_gen_ai_trial)
            .permit(:g_eval_id, :llm_id, :llm_prompt_template_id, guideline_ids: [], prompt_example_ids: [])
        end
      end
    end
  end
end
