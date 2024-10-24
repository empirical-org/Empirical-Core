# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class DatasetsController < ApplicationController
        def new
          @dataset = stem_vault.datasets.new
        end

        def create
          if data_subset?
            redirect_to DataSubsetBuilder.run(parent_id:, test_example_ids:)
          elsif file_upload?
            create_dataset_from_file
          end
        end

        def show
          @dataset = Dataset.find(params[:id])
          @data_subsets = @dataset.data_subsets.order(id: :desc)
          @stem_vault = @dataset.stem_vault
          @trials = @dataset.trials.order(id: :desc)
        end

        private def stem_vault = @stem_vault ||= StemVault.find(params[:stem_vault_id])

        private def create_dataset_from_file
          @dataset = stem_vault.datasets.new(task_type: Dataset::GENERATIVE)

          if @dataset.save
            DatasetImporter.run(dataset: @dataset, file:)
            redirect_to @dataset
          else
            render :new
          end
        end

        private def file_upload? = file.present?
        private def file = dataset_params[:file]
        private def dataset_params = params.require(:research_gen_ai_dataset).permit(:file)

        private def data_subset? = test_example_ids.present? && parent_id.present?
        private def test_example_ids = data_subset_params[:test_example_ids]
        private def parent_id = data_subset_params[:parent_id]

        private def data_subset_params = params.permit(:parent_id, test_example_ids: [])
      end
    end
  end
end
