class Teachers::ProgressReports::StudentsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if is_for_concepts

    else
      @section = Section.find(params[:section_id])
      @topic = Topic.for_progress_report(current_user, params).first
    end

    if request.xhr?
      render json: json_payload
    end
  end

  private

  # This branching probably indicates that this should be 2 different controllers...
  def json_payload
    # TODO: Retrieve units and classrooms differently based on standards vs. concept tags
    units = Unit.for_standards_progress_report(current_user, params)
    classrooms = Classroom.for_standards_progress_report(current_user, params)
    if is_for_concepts
      {
        students: User.for_concept_tag_progress_report(current_user, params),
        concept_tag: ConceptTag.for_progress_report(current_user, params).first,
        classrooms: classrooms,
        units: units
      }
    else
      {
        students: User.for_standards_progress_report(current_user, params),
        classrooms: classrooms,
        units: units,
        topic: @topic
      }
    end
  end

  def is_for_concepts
    params[:concept_category_id].present?
  end

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end
end