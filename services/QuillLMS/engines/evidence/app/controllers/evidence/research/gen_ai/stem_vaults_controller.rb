# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class StemVaultsController < ApplicationController
        def new
          @stem_vault = StemVault.new
          @activities = Activity.all
          @conjunctions = StemVault::CONJUNCTIONS
        end

        def create
          @stem_vault = StemVault.new(stem_vault_params)

          if @stem_vault.save
            redirect_to new_research_gen_ai_trial_path
          else
            render :new
          end
        end

        def show = @stem_vault = StemVault.find(params[:id])

        private def stem_vault_params
          params
            .require(:research_gen_ai_stem_vault)
            .permit(:conjunction, :stem, :activity_id)
        end
      end
    end
  end
end
