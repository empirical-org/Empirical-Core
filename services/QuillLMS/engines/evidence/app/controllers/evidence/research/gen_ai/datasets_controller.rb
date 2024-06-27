# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class DatasetsController < ApplicationController
        def new
          @dataset = stem_vault.datasets.new
        end

        def create
          @dataset = stem_vault.datasets.new(dataset_params)

          if @dataset.save
            DatasetImporter.run(dataset: @dataset, file: dataset_params[:file])
            redirect_to @dataset
          else
            render :new
          end
        end

        def show
          @dataset = Dataset.find(params[:id])
          @trials = @dataset.trials.order(id: :desc)
        end

        private def dataset_params
          params
            .require(:research_gen_ai_dataset)
            .permit(:file)
            .merge(optimal_count: 0, suboptimal_count: 0, locked: false)
        end

        private def stem_vault = @stem_vault ||= StemVault.find(params[:stem_vault_id])
      end
    end
  end
end
