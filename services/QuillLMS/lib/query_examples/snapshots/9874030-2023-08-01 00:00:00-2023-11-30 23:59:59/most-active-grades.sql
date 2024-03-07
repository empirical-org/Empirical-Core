      /* Data Processed By Query: 2.9 GB */

                SELECT IFNULL(CAST(grade AS STRING), 'No grade set') AS value,
        COUNT(DISTINCT session_id) AS count

        FROM lms.recent_reporting_sessions_view
                WHERE
          recent_reporting_sessions_view.completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND recent_reporting_sessions_view.school_id IN (129107,157509)
          
          
          

        GROUP BY grade
        ORDER BY count DESC
        LIMIT 10
