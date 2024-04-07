# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ExperimentsController < ApplicationController
        def index =  @experiments = Experiment.all.order(created_at: :desc)

        def new
          @experiment = Experiment.new
          @llm_configs = LLMConfig.all
          @passage_prompts = PassagePrompt.all
          @llm_prompt_templates = LLMPromptTemplate.all
        end

        def create
          llm_config_ids.each do |llm_config_id|
            llm_prompt_template_ids.each do |llm_prompt_template_id|
              passage_prompt_ids.each do |passage_prompt_id|
                experiment = Experiment.new(llm_config_id:, passage_prompt_id:, num_examples:)
                experiment.llm_prompt = LLMPrompt.create_from_template!(llm_prompt_template_id:, passage_prompt_id:)

                RunExperimentWorker.perform_async(experiment.id) if experiment.save
              end
            end
          end

          redirect_to research_gen_ai_experiments_path
        end

        def show = @experiment = Experiment.find(params[:id])

        private def experiment_params
          params
            .require(:research_gen_ai_experiment)
            .permit(
              :num_examples,
              llm_config_ids: [],
              llm_prompt_template_ids: [],
              passage_prompt_ids: []
            )
        end

        private def llm_config_ids = experiment_params[:llm_config_ids].reject(&:blank?).map(&:to_i)
        private def llm_prompt_template_ids = experiment_params[:llm_prompt_template_ids].reject(&:blank?).map(&:to_i)
        private def passage_prompt_ids = experiment_params[:passage_prompt_ids].reject(&:blank?).map(&:to_i)

        private def num_examples = experiment_params[:num_examples].nil? ? params[:num_examples].to_i : nil
      end
    end
  end
end
