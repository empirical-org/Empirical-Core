      /* Data Processed By Query: 6.74 GB */

        SELECT school_name AS value,
IFNULL(SUM(activity_count),0) AS count

        FROM lms.recent_reporting_sessions_view
                WHERE
          recent_reporting_sessions_view.completed_date BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND recent_reporting_sessions_view.school_id IN (129107,157509)
          
          
          

        GROUP BY school_id, school_name
        ORDER BY count DESC
        LIMIT 10
