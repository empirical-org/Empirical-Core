      /* Data Processed By Query: 12.38 GB */

                SELECT activity_categories.name as value,
        SUM(recent_reporting_sessions.activity_count) AS count

        FROM lms.recent_reporting_sessions        INNER JOIN lms.activity_category_activities
          ON recent_reporting_sessions.activity_id = activity_category_activities.activity_id
        INNER JOIN lms.activity_categories
          ON activity_category_activities.activity_category_id = activity_categories.id

                WHERE
          recent_reporting_sessions.completed_date BETWEEN '2023-08-01 00:00:00' AND '2023-12-01 00:00:00'
          AND recent_reporting_sessions.school_id IN (129107,157509)
          
          
          

        GROUP BY activity_categories.id, activity_categories.name
        ORDER BY count DESC
        LIMIT 10
