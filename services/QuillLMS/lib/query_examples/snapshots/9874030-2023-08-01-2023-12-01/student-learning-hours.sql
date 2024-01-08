      /* Data Processed By Query: 2.31 GB */

        SELECT IFNULL(SUM(recent_reporting_sessions.time_spent), 0) / 3600.0 AS count
        FROM lms.recent_reporting_sessions
                WHERE
          recent_reporting_sessions.completed_date BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          AND recent_reporting_sessions.school_id IN (129107,157509)
          
          
          

        
        
        
