class Teachers::ProgressReports::ConceptTagsStudentsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      render json: json_payload
    else
      @concept_category = ConceptCategory.find(params[:concept_category_id])
      @concept_tag = ConceptTag.find(params[:concept_tag_id])
    end
  end

  private

  def json_payload
    {
      students: User.for_concept_tag_progress_report(current_user, params),
      concept_tag: ConceptTag.for_progress_report(current_user, params).first,
      classrooms: Classroom.for_standards_report(current_user, params),
      units: Unit.for_standards_progress_report(current_user, params)
    }
  end
end