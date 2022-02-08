# frozen_string_literal: true

class Cms::ConceptsController < Cms::CmsController
  def index
    @js_file = 'staff'
    @style_file = 'staff'
  end

  def new
    @level_2_concepts = Concept.where(parent_id: nil, visible: true)
    @concepts = @level_2_concepts.map{|con| ["#{con.name} - Level 2", con.id]}
    @concept = Concept.new
  end

  def create
    @concept = Concept.new(concept_params)
    if @concept.save
      render action: 'index'
    else
      render action: 'new'
    end
  end

  def concepts_in_use
    stored_concepts_in_use = $redis.get('CONCEPTS_IN_USE')
    return unless stored_concepts_in_use

    concepts_in_use = JSON.parse(stored_concepts_in_use)
    csv_str = concepts_in_use.inject([]) { |csv, rows|  csv << CSV.generate_line(rows) }.join
    respond_to do |format|
      format.html
      format.csv { render csv: csv_str, filename: 'concepts_in_use'}
    end
  end

  private def concept_params
    params.require(:concept).permit(:name, :parent_id)
  end
end
