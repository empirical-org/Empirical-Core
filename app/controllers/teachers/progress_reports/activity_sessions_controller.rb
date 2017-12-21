class Teachers::ProgressReports::ActivitySessionsController < Teachers::ProgressReportsController
  PAGE_SIZE = 25;

  def index
    respond_to do |format|
      format.html
      format.json do

        classroom_activities_filter = !params[:classroom_id].blank? ? " AND classroom_activities.classroom_id = #{params[:classroom_id]}" : ''
        student_filter = !params[:student_id].blank? ? " AND activity_sessions.user_id = #{params[:student_id]}" : ''
        unit_filter = !params[:unit_id].blank? ? " AND classroom_activities.unit_id = #{params[:unit_id]}" : ''

        # Do we need to be able to sort by student name?
        # If so, we will need to significantly slow down
        # the query by joining against the users table.

        case(params[:sort_param])
        when 'activity_name'
          sort_field = 'activity_name'
        when 'percentage'
          sort_field = 'percentage'
        when 'standard'
          sort_field = 'standard'
        when 'activity_classification_name'
          sort_field = 'activity_classification_name'
        else
          sort_field = 'completed_at'
        end
        sort_direction = params[:sort_descending] && params[:sort_descending] != 'true' ? 'ASC' : 'DESC'

        activity_sessions = ActiveRecord::Base.connection.execute("
          SELECT
          	activity_classifications.name AS activity_classification_name,
          	classrooms_teachers.classroom_id AS classroom_id,
          	EXTRACT(EPOCH FROM activity_sessions.completed_at) AS completed_at,
          	activity_sessions.percentage AS percentage,
          	topics.name AS standard,
          	activity_sessions.user_id AS student_id,
            activities.name AS activity_name
          FROM classrooms_teachers
          JOIN classrooms
            ON classrooms.id = classrooms_teachers.classroom_id
            AND classrooms.visible = TRUE
          JOIN classroom_activities
          	ON classroom_activities.classroom_id = classrooms.id
            #{classroom_activities_filter}
            #{unit_filter}
            AND classroom_activities.visible = TRUE
          JOIN activity_sessions
          	ON activity_sessions.classroom_activity_id = classroom_activities.id
           AND activity_sessions.state = 'finished'
           AND activity_sessions.visible = TRUE
           #{student_filter}
          JOIN activities
          	ON activities.id = classroom_activities.activity_id
          JOIN activity_classifications
          	ON activity_classifications.id = activities.activity_classification_id
          JOIN topics
          	ON topics.id = activities.topic_id
          WHERE classrooms_teachers.user_id = #{current_user.id}
          ORDER BY #{sort_field} #{sort_direction}
          LIMIT #{PAGE_SIZE}
          OFFSET #{PAGE_SIZE * (params['page'].to_i - 1)};
        ").to_a;

        page_count = (ActiveRecord::Base.connection.execute("
          SELECT count(activity_sessions.id) FROM classrooms_teachers
          JOIN classrooms
            ON classrooms.id = classrooms_teachers.classroom_id
            AND classrooms.visible = TRUE
          JOIN classroom_activities
            ON classroom_activities.classroom_id = classrooms.id
            #{classroom_activities_filter}
            #{unit_filter}
            AND classroom_activities.visible = TRUE
          JOIN activity_sessions
            ON activity_sessions.classroom_activity_id = classroom_activities.id
            AND activity_sessions.visible = TRUE
            #{student_filter}
          WHERE classrooms_teachers.user_id = #{current_user.id}
        ").to_a[0]['count'].to_i / PAGE_SIZE).ceil

        unless(params[:without_filters])
          render json: {
            classrooms: current_user.ids_and_names_of_affiliated_classrooms,
            students: current_user.ids_and_names_of_affiliated_students,
            units: current_user.ids_and_names_of_affiliated_units,
            activity_sessions: activity_sessions,
            page_count: page_count,
          }
        else
          render json: {
            activity_sessions: activity_sessions,
            page_count: page_count,
          }
        end

      end
    end
  end
end
