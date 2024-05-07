        /*
           Data Processed By Query: 5.13 GB
           Bytes Billed For Query:  0.0 GB
           Total Query Time:        707 ms
           Total Slot Time:         2112 ms
           BI Engine Mode Used:     FULL_INPUT
             BI Engine Code:          
             BI Engine Message:       
        */
                SELECT teacher_name AS value,
        COUNT(DISTINCT session_id) AS count

        FROM lms.recent_reporting_sessions_view
                WHERE
          recent_reporting_sessions_view.completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND recent_reporting_sessions_view.school_id IN (129038,11117,129037)
          
          
          

        GROUP BY teacher_id, teacher_name
        ORDER BY count DESC
        LIMIT 10
