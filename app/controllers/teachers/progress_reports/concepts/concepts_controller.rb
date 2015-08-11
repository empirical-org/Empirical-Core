class Teachers::ProgressReports::Concepts::ConceptsController < Teachers::ProgressReportsController
  def index
    respond_to do |format|
      format.html
      format.json do
        render json: json_payload
      end
    end
  end

  private

  def json_payload
    {
      concepts: ::ProgressReports::Concepts::Concept.results(current_user, {})
    }
  end
end