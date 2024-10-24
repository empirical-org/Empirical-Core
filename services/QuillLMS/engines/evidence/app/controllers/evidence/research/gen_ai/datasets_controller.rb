# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class DatasetsController < ApplicationController
        def new
          @dataset = stem_vault.datasets.new
        end

        def create
          # TODO: clean this up once we have full functionality in the Evidence CMS and no longer need the erb tool
          respond_to do |format|
            format.html do
              if data_subset?
                redirect_to DataSubsetBuilder.run(parent_id:, test_example_ids:)
              elsif file_upload?
                create_dataset_from_file_for_html_request
              end
            end

            format.json do
              create_dataset_from_file_for_json_request
            end
          end
        end

        def show
          # TODO: clean this up once we have full functionality in the Evidence CMS and no longer need the erb tool
          @dataset = Dataset.find(params[:id])
          @data_subsets = @dataset.data_subsets.order(id: :desc)
          @stem_vault = @dataset.stem_vault
          @trials = @dataset.trials.order(id: :desc)
          respond_to do |format|
            format.json do
              render json: {
                dataset: @dataset,
                data_subsets: @data_subsets,
                stem_vault: @stem_vault,
                trials: @trials,
                # relevant_texts: RelevantText.where(stem_vault_id: @stem_vault.id),
              }
            end
          end
        end

        private def stem_vault = @stem_vault ||= StemVault.find(params[:stem_vault_id])

        private def create_dataset_from_file_for_html_request
          @dataset = stem_vault.datasets.new(task_type: Dataset::GENERATIVE)

          if @dataset.save
            DatasetImporter.run(dataset: @dataset, file:)
            redirect_to @dataset
          else
            render :new
          end
        end

        private def create_dataset_from_file_for_json_request
          @dataset = stem_vault.datasets.new(dataset_params.merge(task_type: Dataset::GENERATIVE))

          if @dataset.save
            DatasetImporter.run(dataset: @dataset, file:)
            render json: { id: @dataset.id }
          else
            render json: { error: @dataset.errors }, status: 400
          end
        end

        private def file_upload? = file.present?
        private def file = dataset_params[:file]
        private def dataset_params = params.require(:research_gen_ai_dataset).permit(:file, :notes)

        private def data_subset? = test_example_ids.present? && parent_id.present?
        private def test_example_ids = data_subset_params[:test_example_ids]
        private def parent_id = data_subset_params[:parent_id]

        private def data_subset_params = params.permit(:parent_id, test_example_ids: [])
      end
    end
  end
end
