        /*
           Data Processed By Query: 18.95 GB
           Bytes Billed For Query:  0.0 GB
           Total Query Time:        634 ms
           Total Slot Time:         261 ms
           BI Engine Mode Used:     FULL_INPUT
             BI Engine Code:          
             BI Engine Message:       
        */
        SELECT IFNULL(SUM(timespent * 1), 0) / 3600.0 AS count
        FROM lms.recent_reporting_sessions_view
                WHERE
          recent_reporting_sessions_view.completed_at BETWEEN '2023-08-01 00:00:00' AND '2023-11-30 23:59:59'
          AND recent_reporting_sessions_view.school_id IN (129038,11117,129037)
          
          
          

        
        
        
