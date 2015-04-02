class Teachers::ProgressReports::ConceptTagsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      concept_tags = ConceptTag.for_progress_report(current_user, params)
      concept_tags_json = concept_tags.map do |concept_tag|
        serializer = ::ProgressReports::ConceptTagSerializer.new(concept_tag, params)
        serializer.concept_category_id = params[:concept_category_id]
        serializer.as_json(root: false)
      end
      concept_category = ConceptCategory.for_progress_report(current_user, params).first
      units = Unit.for_standards_progress_report(current_user, params)
      students = User.for_concept_tag_progress_report(current_user, params)
      classrooms = Classroom.for_standards_report(current_user, params)
      render json: {
        concept_category: concept_category,
        concept_tags: concept_tags_json,
        units: units,
        students: students,
        classrooms: classrooms
      }
    else
      @concept_category = ConceptCategory.find(params[:concept_category_id])
    end
  end
end