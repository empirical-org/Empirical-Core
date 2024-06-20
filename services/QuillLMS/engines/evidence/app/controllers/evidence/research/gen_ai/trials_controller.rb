# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class TrialsController < ApplicationController
        include TrialsHelper

        def index
          @page = params[:page].to_i > 0 ? params[:page].to_i : 1
          @per_page = 50
          @num_trials = dataset.trials.count
          @trials = dataset.trials.all.order(id: :desc).offset((@page - 1) * @per_page).limit(@per_page)
        end

        def new
          @trial = dataset.trials.new
          @llms = LLM.all
          @llm_prompt_templates = LLMPromptTemplate.all
          @g_evals = GEval.selectable
          @guidelines = dataset.stem_vault.guidelines
          @prompt_examples = dataset.prompt_examples
        end

        def create
          llm_prompt = LLMPrompt.create_from_template!(llm_prompt_template_id:, stem_vault_id:)

          trial = dataset.trials.new(llm_id:, llm_prompt_id: llm_prompt.id)
          trial.results = { g_eval_id: }

          if trial.save
            RunTrialWorker.perform_async(trial.id)
            redirect_to research_gen_ai_trials_path
          else
            render :new
          end
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

        private def trial_params
          params
            .require(:research_gen_ai_trial)
            .permit(:llm_id, :llm_prompt_template_id, :llm_ids, :g_eval_id)
        end

        private def dataset = @dataset ||= Dataset.find(params[:dataset_id])
      end
    end
  end
end
