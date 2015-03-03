class CMS::CsvImports::ConceptTagsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :admin!

  def create
    file = params[:csv_file].tempfile
    concept_tags, concept_categories, concept_classes = ConceptTagImporter.new.import_from_file(file)
    render json: {
      concept_tags: concept_tags.size,
      concept_categories: concept_categories.size,
      concept_classes: concept_classes.size
    }
  end

  private

  def file_params
    params.permit(:csv_file)
  end
end