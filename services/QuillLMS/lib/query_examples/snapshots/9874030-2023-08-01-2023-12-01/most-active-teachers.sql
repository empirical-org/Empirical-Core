      /* Data Processed By Query: 5.0 GB */

                SELECT teacher_name AS value,
        IFNULL(SUM(activity_count),0) AS count

        FROM lms.recent_reporting_sessions_view
                WHERE
          recent_reporting_sessions_view.completed_date BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          AND recent_reporting_sessions_view.school_id IN (129107,157509)
          
          
          

        GROUP BY teacher_id, teacher_name
        ORDER BY count DESC
        LIMIT 10
