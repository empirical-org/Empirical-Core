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
          @experiment = Experiment.new(experiment_params)
          @experiment.llm_prompt = LLMPrompt.create_from_template!(llm_prompt_template_id:, passage_prompt_id:)

          if @experiment.save
            RunExperimentWorker.perform_async(@experiment.id)
            redirect_to @experiment
          else
            render :new
          end
        end

        def show = @experiment = Experiment.find(params[:id])

        private def experiment_params
          params
            .require(:research_gen_ai_experiment)
            .permit(:llm_config_id, :llm_prompt_template_id, :passage_prompt_id)
        end

        private def llm_prompt_template_id = experiment_params[:llm_prompt_template_id].to_i
        private def passage_prompt_id = experiment_params[:passage_prompt_id].to_i
      end
    end
  end
end
