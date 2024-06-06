# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ActivityPromptConfigsController < ApplicationController
        def new
          @activity_prompt_config = ActivityPromptConfig.new
          @activities = Activity.all
          @conjunctions = ActivityPromptConfig::CONJUNCTIONS
        end

        def create
          @activity_prompt_config = ActivityPromptConfig.new(activity_prompt_config_params)

          if @activity_prompt_config.save
            redirect_to new_research_gen_ai_trial_path
          else
            render :new
          end
        end

        def show = @activity_prompt_config = ActivityPromptConfig.find(params[:id])

        private def activity_prompt_config_params
          params
            .require(:research_gen_ai_activity_prompt_config)
            .permit(:conjunction, :optimal_rules, :sub_optimal_rules, :prompt, :activity_id)
        end
      end
    end
  end
end
