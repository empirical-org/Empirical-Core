require 'csv'

class Teachers::ProgressReports::ActivitySessionsController < Teachers::ProgressReportsController
  PAGE_SIZE = 25;

  def index
    respond_to do |format|
      format.html
      format.csv do
        unless current_user.is_premium?
          flash[:warning] = 'Downloadable reports are only available to Premium users.'
          return redirect_to premium_path
        end
        return_data(false)
      end
      format.json do
        return_data(true)
      end
    end
  end

  private def return_data(should_return_json)
    classroom_units_filter = !params[:classroom_id].blank? ? "AND classroom_units.classroom_id = #{params[:classroom_id].to_i}" : ''
    student_filter = !params[:student_id].blank? ? " AND activity_sessions.user_id = #{params[:student_id].to_i}" : ''
    unit_filter = !params[:unit_id].blank? ? " AND classroom_units.unit_id = #{params[:unit_id].to_i}" : ''

    case (params[:sort_param])
    when 'student_id'
      sort_field = 'sorting_name'
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

    query_limit = should_return_json ? "LIMIT #{PAGE_SIZE}" : ''
    query_offset = should_return_json ? "OFFSET #{PAGE_SIZE * (params['page'].to_i - 1)}" : ''

    # Note to maintainers: if you update this query, please be sure to
    # also update the page count query below if applicable.
    activity_sessions = ActiveRecord::Base.connection.execute("
      SELECT
        activity_sessions.id AS activity_session_id,
        activity_classifications.name AS activity_classification_name,
        classrooms_teachers.classroom_id AS classroom_id,
        EXTRACT(EPOCH FROM (activity_sessions.completed_at + INTERVAL '#{current_user.utc_offset} seconds')) AS completed_at,
        activity_sessions.completed_at + INTERVAL '#{current_user.utc_offset} seconds' AS visual_date,
        (CASE WHEN activity_classifications.scored THEN activity_sessions.percentage ELSE -1 END) AS percentage,
        standards.name AS standard,
        activity_sessions.user_id AS student_id,
        activities.name AS activity_name,
        users.name AS student_name,
        substring(users.name from (position(' ' in users.name) + 1) for (char_length(users.name))) || substring(users.name from (1) for (position(' ' in users.name))) AS sorting_name
      FROM classrooms_teachers
      JOIN classrooms
        ON classrooms.id = classrooms_teachers.classroom_id
        AND classrooms.visible = TRUE
      JOIN classroom_units
        ON classroom_units.classroom_id = classrooms.id
        #{classroom_units_filter}
        #{unit_filter}
        AND classroom_units.visible = TRUE
      JOIN students_classrooms
        ON students_classrooms.classroom_id = classrooms.id
        AND students_classrooms.visible = TRUE
      JOIN users
        ON users.id = students_classrooms.student_id
      JOIN activity_sessions
        ON activity_sessions.classroom_unit_id = classroom_units.id
        AND activity_sessions.state = 'finished'
        AND activity_sessions.visible = TRUE
        AND activity_sessions.user_id = users.id
       #{student_filter}
      JOIN activities
        ON activities.id = activity_sessions.activity_id
      JOIN activity_classifications
        ON activity_classifications.id = activities.activity_classification_id
      LEFT JOIN standards
        ON standards.id = activities.standard_id
      WHERE classrooms_teachers.user_id = #{current_user.id}
      ORDER BY #{sort_field} #{sort_direction}
      #{query_limit}
      #{query_offset}
    ").to_a;

    if should_return_json
      page_count = (ActiveRecord::Base.connection.execute("
        SELECT count(activity_sessions.id) FROM classrooms_teachers
        JOIN classrooms
          ON classrooms.id = classrooms_teachers.classroom_id
          AND classrooms.visible = TRUE
        JOIN classroom_units
          ON classroom_units.classroom_id = classrooms.id
          #{classroom_units_filter}
          #{unit_filter}
          AND classroom_units.visible = TRUE
        JOIN students_classrooms
          ON students_classrooms.classroom_id = classrooms.id
          AND students_classrooms.visible = TRUE
        JOIN users
          ON users.id = students_classrooms.student_id
        JOIN activity_sessions
          ON activity_sessions.classroom_unit_id = classroom_units.id
          AND activity_sessions.state = 'finished'
          AND activity_sessions.visible = TRUE
          AND activity_sessions.user_id = users.id
         #{student_filter}
        WHERE classrooms_teachers.user_id = #{current_user.id}
      ").to_a[0]['count'].to_f / PAGE_SIZE).ceil


      if params[:without_filters]
        render json: {
          activity_sessions: activity_sessions,
          page_count: page_count,
        }
      else
        render json: {
          classrooms: current_user.ids_and_names_of_affiliated_classrooms,
          students: current_user.ids_and_names_of_affiliated_students,
          units: current_user.ids_and_names_of_affiliated_units,
          activity_sessions: activity_sessions,
          page_count: page_count,
        }
      end
    else
      csv_string = CSV.generate do |csv|
        csv << ['Student', 'Date', 'Activity', 'Score', 'Standard', 'Tool']
        activity_sessions.map do |session|
          score = (session['percentage'].to_f == -1.0 ? 'Completed' : "#{session['percentage'].to_f*100}%")
          csv << [
            session['student_name'],
            session['visual_date'],
            session['activity_name'],
            score,
            session['standard'],
            session['activity_classification_name']
          ]
        end
      end
      render text: csv_string
    end
  end
end
