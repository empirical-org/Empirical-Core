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
            DatasetImporter.run(dataset: @dataset, file:)
            redirect_to @dataset
          else
            render :new
          end
        end

        def show
          @dataset = Dataset.find(params[:id])
          @stem_vault = @dataset.stem_vault
          @trials = @dataset.trials.order(id: :desc)
        end

        private def dataset_params = params.require(:research_gen_ai_dataset).permit(:file)
        private def file = dataset_params[:file]
        private def stem_vault = @stem_vault ||= StemVault.find(params[:stem_vault_id])
      end
    end
  end
end
