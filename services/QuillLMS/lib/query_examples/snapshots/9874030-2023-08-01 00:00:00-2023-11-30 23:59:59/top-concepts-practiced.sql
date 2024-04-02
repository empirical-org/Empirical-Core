      /* Data Processed By Query: 18.65 GB */

                SELECT activity_categories.name as value,
        COUNT(DISTINCT recent_reporting_sessions_view.session_id) AS count

        FROM lms.recent_reporting_sessions_view        INNER JOIN lms.activity_category_activities
          ON recent_reporting_sessions_view.activity_id = activity_category_activities.activity_id
        INNER JOIN lms.activity_categories
          ON activity_category_activities.activity_category_id = activity_categories.id

                WHERE
          recent_reporting_sessions_view.completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND recent_reporting_sessions_view.school_id IN (129107,157509)
          
          
          

        GROUP BY activity_categories.id, activity_categories.name
        ORDER BY count DESC
        LIMIT 10
