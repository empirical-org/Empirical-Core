      /* Data Processed By Query: 2.51 GB */

                SELECT IFNULL(CAST(grade AS STRING), 'No grade set') AS value,
        SUM(activity_count) AS count

        FROM lms.recent_reporting_sessions
                WHERE
          recent_reporting_sessions.completed_date BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          AND recent_reporting_sessions.school_id IN (129107,157509)
          
          
          

        GROUP BY grade
        ORDER BY count DESC
        LIMIT 10
