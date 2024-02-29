      /* Data Processed By Query: 16.21 GB */

        SELECT IFNULL(SUM(question_count * 1), 0) AS count
        FROM lms.recent_reporting_sessions_view
                WHERE
          recent_reporting_sessions_view.completed_date BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          AND recent_reporting_sessions_view.school_id IN (129107,157509)
          
          
          

        
        
        
