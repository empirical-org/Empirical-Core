# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class PassagePromptsController < ApplicationController
        def new
          @passage_prompt = PassagePrompt.new
          @passages = Passage.all
          @conjunctions = PassagePrompt::CONJUNCTIONS
        end

        def create
          @passage_prompt = PassagePrompt.new(passage_prompt_params)

          if @passage_prompt.save
            redirect_to research_gen_ai_experiments_path
          else
            render :new
          end
        end

        def show = @passage_prompt = PassagePrompt.find(params[:id])

        private def passage_prompt_params
          params
            .require(:research_gen_ai_passage_prompt)
            .permit(:conjunction, :instructions, :prompt, :passage_id)
        end
      end
    end
  end
end
