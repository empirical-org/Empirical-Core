# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class PassagesController < ApplicationController
        def new
          @passage = Passage.new
        end

        def create
          @passage = Passage.new(passage_params)

          if @passage.save
            redirect_to new_research_gen_ai_experiment_path
          else
            render :new
          end
        end

        def show = @passage = Passage.find(params[:id])

        private def passage_params
          params
            .require(:research_gen_ai_passage)
            .permit(:name, :contents)
        end
      end
    end
  end
end
