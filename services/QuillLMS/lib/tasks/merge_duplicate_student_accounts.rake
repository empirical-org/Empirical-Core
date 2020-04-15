namespace :merge_duplicates do
  task :google_students => :environment do
    include MergeHelpers
    merge_students duplicate_google_sql
  end

  task :clever_students => :environment do
    include MergeHelpers
    merge_students duplicate_clever_sql
  end

  module MergeHelpers
    def duplicate_google_sql
      sql = <<~SQL.squish
        SELECT
        a.id AS a_id,
        b.id AS b_id,
        a.name AS a_name,
        b.name AS b_name,
        a.count AS a_activity_sessions_count,
        b.count AS b_activity_sessions_count,
        a.email AS a_email,
        b.email AS b_email,
        a.google_id AS a_google_id,
        b.google_id AS b_google_id,
        a.username AS a_username,
        b.username AS b_username FROM (
        SELECT users.id, name, email, google_id, username, activity_sessions.count FROM users
        LEFT JOIN activity_sessions ON activity_sessions.user_id = users.id AND activity_sessions.state = 'finished'
        WHERE google_id IS NOT NULL AND google_id != '' AND role = 'student'
        GROUP BY users.id, name, email, google_id, username
        ) as a
        INNER JOIN(
        SELECT users.id, name, email, google_id, username, activity_sessions.count FROM users
        LEFT JOIN activity_sessions ON activity_sessions.user_id = users.id AND activity_sessions.state = 'finished'
        WHERE google_id IS NOT NULL AND google_id != '' AND role = 'student'
        GROUP BY users.id, name, email, google_id, username
        ) as b
        ON a.google_id = b.google_id
        WHERE CASE WHEN a.count = b.count THEN a.id > b.id ELSE a.count > b.count END
      SQL
    end

    def duplicate_clever_sql
      sql = <<~SQL.squish
        SELECT
        a.id AS a_id,
        b.id AS b_id,
        a.name AS a_name,
        b.name AS b_name,
        a.count AS a_activity_sessions_count,
        b.count AS b_activity_sessions_count,
        a.email AS a_email,
        b.email AS b_email,
        a.clever_id AS a_clever_id,
        b.clever_id AS b_clever_id,
        a.username AS a_username,
        b.username AS b_username FROM (
        SELECT users.id, name, email, clever_id, username, activity_sessions.count FROM users
        LEFT JOIN activity_sessions ON activity_sessions.user_id = users.id AND activity_sessions.state = 'finished'
        WHERE clever_id IS NOT NULL AND clever_id != '' AND role = 'student'
        GROUP BY users.id, name, email, clever_id, username
        ) as a
        INNER JOIN(
        SELECT users.id, name, email, clever_id, username, activity_sessions.count FROM users
        LEFT JOIN activity_sessions ON activity_sessions.user_id = users.id AND activity_sessions.state = 'finished'
        WHERE clever_id IS NOT NULL AND clever_id != '' AND role = 'student'
        GROUP BY users.id, name, email, clever_id, username
        ) as b
        ON a.clever_id = b.clever_id
        WHERE CASE WHEN a.count = b.count THEN a.id > b.id ELSE a.count > b.count END
      SQL
    end

    def merge_students(sql)
      duplicated_student_records = ActiveRecord::Base.connection.execute(sql).to_a

      fixed_student_rows = []
      not_fixed_student_rows = []

      duplicated_student_records.each do |r|
        good_user = User.find_by_id(r['a_id'])
        bad_user = User.find_by_id(r['b_id'])
        if good_user && bad_user
          StudentsClassrooms.unscoped.where(student_id: bad_user.id).each do |sc|
            StudentsClassrooms.unscoped.find_or_create_by(student_id: good_user.id, classroom_id: sc.classroom_id)
          end
          good_user.merge_activity_sessions(bad_user)
          bad_user.remove_student_classrooms
          bad_user.clear_data
          fixed_student_rows.push(r)
        else
          not_fixed_student_rows.push(r)
        end
      end

      puts 'NOT_FIXED_STUDENT_ROWS'
      puts not_fixed_student_rows
    end
  end    
end