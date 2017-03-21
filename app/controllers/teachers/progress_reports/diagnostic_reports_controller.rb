class Teachers::ProgressReports::DiagnosticReportsController < Teachers::ProgressReportsController
  include PublicProgressReports

  def show
    @classroom_id = current_user.classrooms_i_teach.last.id || nil
    @report = params[:report] || 'question'
  end

  def question_view
    render json:  {data:   results_by_question(params)}.to_json
  end

  def students_by_classroom
    render json: results_for_classroom(params[:unit_id], params[:activity_id], params[:classroom_id])
  end


  def classrooms_with_students
    classrooms = classrooms_with_students_that_completed_activity(params[:unit_id], params[:activity_id])
    render json: classrooms.to_json
  end

  def recommendations_for_classroom
    render json: get_recommendations_for_classroom(params[:classroom_id], params[:activity_id])
  end

  def assign_selected_packs
    create_or_update_selected_packs
    AssignRecommendationsWorker.perform_async(current_user.id)
    render json: {data: "Hi"}
  end

  def default_diagnostic_report
    redirect_to default_diagnostic_url
  end

  def report_from_activity_session
    act_sesh_report = activity_session_report(params[:activity_session].to_i)
    render json: act_sesh_report.to_json
  end

  private

  def create_or_update_selected_packs
    teacher_id = current_user.id
    params[:selections].reverse.each do |value|
      if value[:classrooms][0][:student_ids].any?
        unit = Unit.find_by(name: UnitTemplate.find(value[:id]).name,
                           user_id: teacher_id)
        if unit
          Units::Updater.assign_unit_template_to_one_class(unit, value[:classrooms])
        else
        #  TODO: use a find or create for the unit var above.
        #  This way, we can just pass the units creator a unit argument.
        #  The reason we are not doing so at this time, is because the unit creator
        #  Is used elsewhere, and we do not want to overly optimize it for the diagnostic
          Units::Creator.assign_unit_template_to_one_class(teacher_id, value[:id], value[:classrooms])
        end
      end
    end
  end


end
