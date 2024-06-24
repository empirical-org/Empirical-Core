# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class GuidelinesController < ApplicationController
        def new
          @guideline = stem_vault.guidelines.new
          @categories = Guideline::CATEGORIES
        end

        def create
          @guideline = stem_vault.guidelines.new(guideline_params)

          if @guideline.save
            redirect_to @guideline.stem_vault
          else
            render :new
          end
        end

        private def guideline_params
          params
            .require(:research_gen_ai_guideline)
            .permit(:category, :text)
        end

        private def stem_vault = @stem_vault ||= StemVault.find(params[:stem_vault_id])
      end
    end
  end
end
