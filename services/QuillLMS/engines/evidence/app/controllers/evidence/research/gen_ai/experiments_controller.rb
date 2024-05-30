# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ExperimentsController < ApplicationController
        include ExperimentsHelper

        def index
          completed_experiments =
            Experiment
              .completed
              .pluck(:llm_config_id, :llm_prompt_id, :passage_prompt_id, :num_examples)
              .map { |llm_config_id, llm_prompt_id, passage_prompt_id, num_examples| { llm_config_id:, llm_prompt_id:, passage_prompt_id:, num_examples: } }
              .to_set

          @experiments = Experiment.all.reject do |experiment|
            experiment.failed? && completed_experiments.include?(
              llm_config_id: experiment.llm_config_id,
              llm_prompt_id: experiment.llm_prompt_id,
              passage_prompt_id: experiment.passage_prompt_id,
              num_examples: experiment.num_examples
            )
          end.sort_by(&:id).reverse
        end

        def new
          @experiment = Experiment.new
          @llm_configs = LLMConfig.all
          @passage_prompts = PassagePrompt.all
          @llm_prompt_templates = LLMPromptTemplate.all
          @g_evals = GEval.selectable
        end

        def create
          llm_config_ids.each do |llm_config_id|
            llm_prompt_template_ids.each do |llm_prompt_template_id|
              passage_prompt_ids.each do |passage_prompt_id|
                llm_prompt = LLMPrompt.create_from_template!(llm_prompt_template_id:, passage_prompt_id:)

                run_experiment(
                  llm_config_id:,
                  llm_prompt_id: llm_prompt.id,
                  passage_prompt_id:,
                  num_examples: num_examples(passage_prompt_id)
                )
              end
            end
          end

          redirect_to research_gen_ai_experiments_path
        end

        def show
          @experiment = Experiment.find(params[:id])
          @histogram = @experiment.api_call_times.map(&:round).tally if @experiment.api_call_times.present?
          @next = Experiment.where("id > ?", @experiment.id).order(id: :asc).first
          @previous = Experiment.where("id < ?", @experiment.id).order(id: :desc).first
          @g_evals = GEval.where(id: @experiment.g_evals.keys).order(:id)
        end

        def retry
          run_experiment(**Experiment.find(params[:id]).retry_params)

          redirect_to research_gen_ai_experiments_path
        end

        private def run_experiment(llm_config_id:, llm_prompt_id:, passage_prompt_id:, num_examples:)
          results = { g_evals:  g_eval_ids.index_with { |id| [] } }
          experiment = Experiment.new(llm_config_id:, passage_prompt_id:, llm_prompt_id:, num_examples:, results:)

          RunExperimentWorker.perform_async(experiment.id) if experiment.save
        end

        private def experiment_params
          params
            .require(:research_gen_ai_experiment)
            .permit(
              :num_examples,
              llm_config_ids: [],
              llm_prompt_template_ids: [],
              passage_prompt_ids: [],
              g_eval_ids: []
            )
        end

        private def llm_config_ids = experiment_params[:llm_config_ids].reject(&:blank?).map(&:to_i)
        private def llm_prompt_template_ids = experiment_params[:llm_prompt_template_ids].reject(&:blank?).map(&:to_i)
        private def passage_prompt_ids = experiment_params[:passage_prompt_ids].reject(&:blank?).map(&:to_i)
        private def g_eval_ids = experiment_params[:g_eval_ids].reject(&:blank?).map(&:to_i).sort

        private def num_examples(passage_prompt_id)
          max_num_examples = PassagePrompt.find(passage_prompt_id).passage_prompt_responses.testing_data.count

          return max_num_examples if experiment_params[:num_examples].blank?

          [max_num_examples, experiment_params[:num_examples].to_i].min
        end
      end
    end
  end
end
