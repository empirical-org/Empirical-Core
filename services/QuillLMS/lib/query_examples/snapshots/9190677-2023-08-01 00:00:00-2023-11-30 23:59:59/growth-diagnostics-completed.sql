        /*
           Data Processed By Query: 3.44 GB
           Bytes Billed For Query:  0.0 GB
           Total Query Time:        390 ms
           Total Slot Time:         759 ms
           BI Engine Mode Used:     FULL_INPUT
             BI Engine Code:          
             BI Engine Message:       
        */
        SELECT COUNT(DISTINCT session_id) AS count
        FROM lms.recent_reporting_sessions_view
                WHERE
          recent_reporting_sessions_view.completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND recent_reporting_sessions_view.school_id IN (129038,11117,129037)
          
          
          
        AND activity_id IN (1774,1814,1818,1664,1669,1680)

        
        
        
