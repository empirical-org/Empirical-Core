# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class StemVaultsController < ApplicationController
        def new
          @stem_vault = activity.stem_vaults.new
          @conjunctions = StemVault::CONJUNCTIONS
        end

        def create
          @stem_vault = activity.stem_vaults.new(stem_vault_params)

          if @stem_vault.save
            redirect_to @stem_vault
          else
            render :new
          end
        end

        def show
          @stem_vault = StemVault.find(params[:id])
          @datasets = @stem_vault.datasets.order(id: :desc)
          @optimal_guidelines = @stem_vault.guidelines.optimal.visible
          @suboptimal_guidelines = @stem_vault.guidelines.suboptimal.visible
        end

        private def activity = @activity ||= Activity.find(params[:activity_id])

        private def stem_vault_params
          params
            .require(:research_gen_ai_stem_vault)
            .permit(:conjunction, :stem, :activity_id)
        end
      end
    end
  end
end
