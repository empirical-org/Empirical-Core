class Teachers::ProgressReports::DiagnosticReportsController < Teachers::ProgressReportsController
    include PublicProgressReports
    include LessonsRecommendations
    require 'pusher'

    def show
        @classroom_id = current_user.classrooms_i_teach&.last&.id || nil
        @report = params[:report] || 'question'
    end

    def question_view
        render json: { data:   results_by_question(params) }.to_json
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

    def lesson_recommendations_for_classroom
        render json: {lessonsRecommendations: get_recommended_lessons(params[:unit_id], params[:classroom_id], params[:activity_id])}
    end

    def previously_assigned_recommendations
      render json: get_previously_assigned_recommendations_by_classroom(params[:classroom_id], params[:activity_id])
    end

    def assign_selected_packs
        create_or_update_selected_packs
        render json: { data: 'Hi' }
    end

    def default_diagnostic_report
        redirect_to default_diagnostic_url
    end

    def report_from_activity_session
        act_sesh_report = activity_session_report(params[:activity_session].to_i)
        render json: act_sesh_report.to_json
    end

    def diagnostic_status
      diagnostic_activity_ids = [413, 447]
      cas = current_user.classrooms_i_teach.includes(:students, :classroom_activities).where(classroom_activities: {activity_id: diagnostic_activity_ids}).map(&:classroom_activities).flatten
      if cas.any? && cas.any?{|ca| ca.has_a_completed_session? && ca.from_valid_date_for_activity_analysis? }
        diagnostic_status = 'completed'
      elsif cas.any?
        diagnostic_status = 'assigned'
      else
        diagnostic_status = 'unassigned'
      end
      render json: {diagnosticStatus: diagnostic_status}
    end


    private

    def create_or_update_selected_packs
        teacher_id = current_user.id
        selections_with_students = params["selections"].select do |ut|
          ut["classrooms"][0]["student_ids"].any?
        end
        if selections_with_students.any?
          number_of_selections = selections_with_students.length
          selections_with_students.reverse.each_with_index do |value, index|
              last = (number_of_selections - 1) == index
              # this only accommodates one classroom at a time
              classroom = value["classrooms"][0]
              AssignRecommendationsWorker.perform_async(value["id"], classroom["id"], classroom["student_ids"].compact, last)
          end
        end
    end
end
