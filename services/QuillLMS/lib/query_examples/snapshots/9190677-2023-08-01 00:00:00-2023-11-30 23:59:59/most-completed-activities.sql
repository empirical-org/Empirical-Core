        /*
           Data Processed By Query: 7.45 GB
           Bytes Billed For Query:  0.0 GB
           Total Query Time:        597 ms
           Total Slot Time:         1673 ms
           BI Engine Mode Used:     FULL_INPUT
             BI Engine Code:          
             BI Engine Message:       
        */
                SELECT activity_name AS value,
        COUNT(DISTINCT session_id) AS count

        FROM lms.recent_reporting_sessions_view
                WHERE
          recent_reporting_sessions_view.completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND recent_reporting_sessions_view.school_id IN (129038,11117,129037)
          
          
          

        GROUP BY activity_id, activity_name
        ORDER BY count DESC
        LIMIT 10
