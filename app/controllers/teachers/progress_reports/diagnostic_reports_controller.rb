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
        render json: get_recommendations_for_classroom(params[:unit_id], params[:classroom_id], params[:activity_id])
    end

    def lesson_recommendations_for_classroom
        render json: {lessonsRecommendations: get_recommended_lessons(params[:unit_id], params[:classroom_id], params[:activity_id])}
    end

    def previously_assigned_recommendations
      render json: get_previously_assigned_recommendations_by_classroom(params[:classroom_id], params[:activity_id])
    end

    def redirect_to_report_for_most_recent_activity_session_associated_with_activity_and_unit
      params.permit(:unit_id, :activity_id)
      unit_id = params[:unit_id]
      activity_id = params[:activity_id]
      classroom_hash = ActiveRecord::Base.connection.execute("
        SELECT classroom_activities.classroom_id from classroom_activities
        LEFT JOIN activity_sessions ON classroom_activities.id = activity_sessions.classroom_activity_id
        WHERE classroom_activities.unit_id = #{ActiveRecord::Base.sanitize(unit_id)}
          AND classroom_activities.activity_id = #{ActiveRecord::Base.sanitize(activity_id)}
          AND activity_sessions.is_final_score = TRUE
        ORDER BY activity_sessions.updated_at DESC
        LIMIT 1;").to_a
      if !classroom_hash[0]
        return render status: 404
      end
      classroom_id = classroom_hash[0]['classroom_id']
      return render json: { url: "/teachers/progress_reports/diagnostic_reports#/u/#{unit_id}/a/#{activity_id}/c/#{classroom_id}/students" }
    end

    def assign_selected_packs
        create_or_update_selected_packs
        render json: { data: 'Hi' }
    end

    def default_diagnostic_report
        redirect_to default_diagnostic_url
    end

    def report_from_classroom_activity
      url = classroom_report_url(params[:classroom_activity_id].to_i)
      if url
        redirect_to url
      else
        redirect_to teachers_progress_reports_landing_page_path
      end
    end

    def report_from_classroom_activity_and_user
        act_sesh_report = activity_session_report(params[:classroom_activity_id].to_i, params[:user_id].to_i)
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
        if params[:whole_class]
          UnitTemplate.assign_to_whole_class(params[:classroom_id], params[:unit_template_id])
        else
          teacher_id = current_user.id
          selections_with_students = params[:selections].select do |ut|
            puts 'i am being called and the array is'
            puts ut[:classrooms][0][:student_ids]&.compact&.any?
            ut[:classrooms][0][:student_ids]&.compact&.any?
          end
          puts 'selections with students here'
          puts selections_with_students
          if selections_with_students.any?
            number_of_selections = selections_with_students.length
            selections_with_students.reverse.each_with_index do |value, index|
                last = (number_of_selections - 1) == index
                # this only accommodates one classroom at a time
                classroom = value[:classrooms][0]
                AssignRecommendationsWorker.perform_async(value[:id], classroom[:id], classroom[:student_ids].compact, last, false)
            end
          end
        end
    end

end
