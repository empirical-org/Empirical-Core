namespace :duplicate_clever_accounts do
  task :merge => :environment do

    duplicated_student_records = ActiveRecord::Base.connection.execute(
      "SELECT
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
      WHERE CASE WHEN a.count = b.count THEN a.id > b.id ELSE a.count > b.count END"
    ).to_a

    fixed_student_rows = []
    not_fixed_student_rows = []

    duplicated_student_records.each do |r|
      good_user = User.find_by_id(r['a_id'])
      bad_user = User.find_by_id(r['b_id'])
      if good_user && bad_user
        StudentsClassrooms.unscoped.where(student_id: bad_user.id).each do |sc|
          StudentsClassrooms.unscoped.find_or_create_by(student_id: good_user.id, classroom_id: sc.classroom_id)
        end
        SalesContact.where(user_id: bad_user.id).each do |sc|
          sc.user_id = good_user.id
          sc.destroy unless sc.save
        end
        good_user.merge_activity_sessions(bad_user)
        bad_user.remove_student_classrooms
        bad_user.destroy
        fixed_student_rows.push(r)
      else
        not_fixed_student_rows.push(r)
      end
    end

    puts NOT_FIXED_STUDENT_ROWS
    puts not_fixed_student_rows.to_json

    duplicated_teacher_records = ActiveRecord::Base.connection.execute(
      "SELECT
        a.id AS a_id,
        b.id AS b_id,
        a.name AS a_name,
        b.name AS b_name,
        a.count AS a_units_count,
        b.count AS b_units_count,
        a.email AS a_email,
        b.email AS b_email,
        a.clever_id AS a_clever_id,
        b.clever_id AS b_clever_id FROM (
        SELECT users.id, users.name, email, clever_id, username, units.count FROM users
        LEFT JOIN units ON units.user_id = users.id
        WHERE clever_id IS NOT NULL AND clever_id != '' AND role = 'teacher'
        GROUP BY users.id, users.name, email, clever_id, username
        ) as a
        INNER JOIN(
        SELECT users.id, users.name, email, clever_id, username, units.count FROM users
        LEFT JOIN units ON units.user_id = users.id
        WHERE clever_id IS NOT NULL AND clever_id != '' AND role = 'teacher'
        GROUP BY users.id, users.name, email, clever_id, username
        ) as b
        ON a.clever_id = b.clever_id
        WHERE CASE WHEN a.count = b.count THEN a.id > b.id ELSE a.count > b.count END
      "
    ).to_a

    fixed_teacher_rows = []
    not_fixed_teacher_rows = []

    duplicated_teacher_records.each do |r|
      good_user = User.find_by_id(r['a_id'])
      bad_user = User.find_by_id(r['b_id'])

      if good_user && bad_user
        ClassroomsTeacher.unscoped.where(user_id: bad_user.id).each do |sc|
          good_sc = ClassroomsTeacher.find_by(user_id: good_user.id, classroom_id: sc.classroom_id)
          if good_sc
            sc.destroy
            good_sc.update(role: 'owner')
          else
            sc.update(user_id: good_user.id)
          end
        end

        Unit.unscoped.where(user_id: bad_user.id).update_all(user_id: good_user.id)

        SalesContact.where(user_id: bad_user.id).each do |sc|
          sc.user_id = good_user.id
          sc.destroy unless sc.save
        end

        bad_user.destroy
        fixed_teacher_rows.push(r)
      else
        not_fixed_teacher_rows.push(r)
      end
    end

    puts NOT_FIXED_TEACHER_ROWS
    puts not_fixed_teacher_rows.to_json

  end
end
