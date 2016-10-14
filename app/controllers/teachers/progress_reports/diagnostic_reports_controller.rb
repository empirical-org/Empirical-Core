class Teachers::ProgressReports::DiagnosticReportsController < Teachers::ProgressReportsController
  include PublicProgressReports

  def show
    @classroom_id = current_user.classrooms_i_teach.last.id || nil
    @report = params[:report] || 'question'
  end

  def question_view
    results_by_question(params)
    render json:  {data: results_by_question}.to_json
  end

  def students_by_classroom
    render json: results_for_classroom(params[:unit_id], params[:activity_id], params[:classroom_id])
  end


  def classrooms_with_students
    classrooms = classrooms_with_students_that_completed_activity(params[:unit_id], params[:activity_id])
    render json: classrooms.to_json
  end

  def recommendations_for_classroom
    render json: get_recommendations_for_classroom(params[:classroom_id])
  end

  def assign_selected_packs
    teacher_id = current_user.id
    classroom_id = params[:classroom_id]
    params[:selections].values.each do |value|
      Units::Creator.assign_unit_template_to_one_class(teacher_id, value[:id], classroom_id, value[:student_ids])
    end
    render json: {data: "Hi"}
  end

  def default_diagnostic_report
    redirect_to default_diagnostic_url
  end


end
