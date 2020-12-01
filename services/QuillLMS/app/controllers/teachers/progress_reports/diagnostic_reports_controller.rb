class Teachers::ProgressReports::DiagnosticReportsController < Teachers::ProgressReportsController
    include PublicProgressReports
    include LessonsRecommendations
    require 'pusher'

    before_filter :authorize_teacher!, only: [:question_view, :students_by_classroom, :recommendations_for_classroom, :lesson_recommendations_for_classroom, :previously_assigned_recommendations]

    def show
        @classroom_id = current_user.classrooms_i_teach&.last&.id || nil
        @report = params[:report] || 'question'
    end

    def question_view
        render json: { data: results_by_question(params) }.to_json
    end

    def students_by_classroom
        render json: results_for_classroom(params[:unit_id], params[:activity_id], params[:classroom_id])
    end

    def classrooms_with_students
      classrooms = classrooms_with_students_for_report(params[:unit_id], params[:activity_id])
      render json: classrooms.to_json
    end

    def recommendations_for_classroom
        render json: generate_recommendations_for_classroom(params[:unit_id], params[:classroom_id], params[:activity_id])
    end

    def lesson_recommendations_for_classroom
      render json: {lessonsRecommendations: get_recommended_lessons(params[:unit_id], params[:classroom_id], params[:activity_id])}
    end

    def diagnostic_activity_ids
      render json: { diagnosticActivityIds: Activity.diagnostic_activity_ids }
    end

    def activity_with_recommendations_ids
      render json: { activityWithRecommendationsIds: Activity.activity_with_recommendations_ids}
    end

    def previously_assigned_recommendations
      render json: get_previously_assigned_recommendations_by_classroom(params[:classroom_id], params[:activity_id])
    end

    def redirect_to_report_for_most_recent_activity_session_associated_with_activity_and_unit
      params.permit(:unit_id, :activity_id)
      unit_id = params[:unit_id]
      activity_id = params[:activity_id]
      classroom_units = ClassroomUnit.where(unit_id: unit_id, classroom_id: current_user.classrooms_i_teach.map(&:id))
      last_activity_session = ActivitySession.where(classroom_unit: classroom_units, activity_id: activity_id, is_final_score: true).order(updated_at: :desc).limit(1)&.first
      classroom_id = last_activity_session&.classroom_unit&.classroom_id
      if !classroom_id
        return render json: {}, status: 404
      end
      render json: { url: "/teachers/progress_reports/diagnostic_reports#/u/#{unit_id}/a/#{activity_id}/c/#{classroom_id}/students" }
    end

    def assign_selected_packs
        if params[:selections]
          params[:selections].map { |s| s['id']}.each do |ut_id|
            ut = UnitTemplate.find(ut_id)
            Unit.unscoped.find_or_create_by(unit_template_id: ut.id, name: ut.name, user_id: current_user.id)
          end
        end
        create_or_update_selected_packs
        render json: { data: 'Hi' }
    end

    def default_diagnostic_report
        redirect_to default_diagnostic_url
    end

    def report_from_classroom_unit_and_activity
      activity = Activity.find_by_id_or_uid(params[:activity_id])
      url = classroom_report_url(params[:classroom_unit_id].to_i, activity.id)

      if url
        redirect_to url
      else
        redirect_to teachers_progress_reports_landing_page_path
      end
    end

    def report_from_classroom_unit_activity_and_user
        act_sesh_report = activity_session_report(params[:classroom_unit_id].to_i, params[:user_id].to_i, params[:activity_id].to_i)
        respond_to do |format|
          format.html { redirect_to act_sesh_report[:url] }
          format.json { render json: act_sesh_report.to_json }
        end
    end

    def diagnostic_status
      cas = ActiveRecord::Base.connection.execute("
        SELECT activity_sessions.state
        FROM classrooms_teachers
        JOIN classrooms
          ON  classrooms_teachers.classroom_id = classrooms.id
          AND classrooms.visible = TRUE
        JOIN classroom_units
          ON  classrooms.id = classroom_units.classroom_id
          AND classroom_units.visible = TRUE
        JOIN unit_activities
          ON classroom_units.unit_id = unit_activities.unit_id
          AND unit_activities.visible = TRUE
          AND unit_activities.activity_id IN (#{Activity.diagnostic_activity_ids.join(', ')})
        LEFT JOIN activity_sessions
          ON  classroom_units.id = activity_sessions.classroom_unit_id
          AND unit_activities.activity_id = activity_sessions.activity_id
          AND activity_sessions.state = 'finished'
          AND activity_sessions.visible = TRUE
        WHERE classrooms_teachers.user_id = #{current_user.id}
      ").to_a
      if cas.include?('finished')
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
        $redis.set("user_id:#{current_user.id}_lesson_diagnostic_recommendations_start_time", Time.now)
        return render json: {}, status: 401 unless current_user.classrooms_i_teach.map(&:id).include?(params[:classroom_id].to_i)
        UnitTemplate.assign_to_whole_class(params[:classroom_id], params[:unit_template_id])
      else
        selections_with_students = params[:selections].select do |ut|
          ut[:classrooms][0][:student_ids]&.compact&.any?
        end
        if selections_with_students.any?
          $redis.set("user_id:#{current_user.id}_diagnostic_recommendations_start_time", Time.now)
          number_of_selections = selections_with_students.length
          selections_with_students.each_with_index do |value, index|
              last = (number_of_selections - 1) == index
              # this only accommodates one classroom at a time
              classroom = value[:classrooms][0]
              argument_hash = {
                unit_template_id: value[:id],
                classroom_id: classroom[:id],
                student_ids: classroom[:student_ids].compact,
                last: last,
                lesson: false,
                assigning_all_recommended_packs: params[:assigning_all_recommended_packs]
              }
              AssignRecommendationsWorker.new.perform(argument_hash) if current_user.classrooms_i_teach.map(&:id).include?(classroom[:id].to_i)
          end
        end
      end
    end

    def authorize_teacher!
      classroom_teacher!(params[:classroom_id])
    end

end
