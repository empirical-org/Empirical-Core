      /* Data Processed By Query: 3.45 GB */

        SELECT COUNT(DISTINCT session_id) AS count
        FROM lms.recent_reporting_sessions_view
                WHERE
          recent_reporting_sessions_view.completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND recent_reporting_sessions_view.school_id IN (129107,157509)
          
          
          
        AND activity_id IN (1680,1814,1774,1669,1818,1664)

        
        
        
