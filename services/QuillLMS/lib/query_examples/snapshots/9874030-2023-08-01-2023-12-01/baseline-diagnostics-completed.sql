      /* Data Processed By Query: 3.66 GB */

        SELECT SUM(activity_count) AS count
        FROM lms.recent_reporting_sessions
                WHERE
          recent_reporting_sessions.completed_date BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          AND recent_reporting_sessions.school_id IN (129107,157509)
          
          
          
        AND activity_id IN (1663,1668,1678,1161,1568,1590)

        
        
        
