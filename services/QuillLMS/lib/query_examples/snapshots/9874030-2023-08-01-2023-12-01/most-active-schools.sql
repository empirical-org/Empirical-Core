      /* Data Processed By Query: 4.18 GB */

        SELECT school_name AS value,
SUM(activity_count) AS count

        FROM lms.recent_reporting_sessions
                WHERE
          recent_reporting_sessions.completed_date BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          AND recent_reporting_sessions.school_id IN (129107,157509)
          
          
          

        GROUP BY school_id, school_name
        ORDER BY count DESC
        LIMIT 10
