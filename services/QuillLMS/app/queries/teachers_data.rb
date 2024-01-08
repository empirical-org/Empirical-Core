# frozen_string_literal: true

module TeachersData
  # num_students

  # use Outer Joins to account for the fact that some of the teachers shown in the Premium Hub dashboard
  # will have no classrooms, etc.

  def self.run(teacher_ids)
    return [] if teacher_ids.blank?

    teacher_ids_str = teacher_ids.join(', ')

    number_of_students_query = User.find_by_sql(
      "SELECT
        users.id,
        users.name,
        users.email,
        users.last_sign_in,
        COUNT(DISTINCT students_classrooms.id) AS number_of_students
      FROM users
      LEFT OUTER JOIN classrooms_teachers ON users.id = classrooms_teachers.user_id
      LEFT OUTER JOIN classrooms ON classrooms_teachers.classroom_id = classrooms.id AND classrooms.visible = true
      LEFT OUTER JOIN students_classrooms ON classrooms.id = students_classrooms.classroom_id AND students_classrooms.visible = true
      WHERE users.id IN (#{teacher_ids_str})
      GROUP BY users.id"
    )

    combiner = {}
    number_of_students_query.each do |row|
      combiner[row.id] = {
        name: row.name,
        email: row.email,
        school: row.school,
        last_sign_in: row.last_sign_in,
        number_of_students: row.number_of_students
      }
    end

    result = combiner.keys.map do |key|
      hash_value = combiner[key]
      user = User.new(
        id: key,
        name: hash_value[:name],
        email: hash_value[:email],
        school: hash_value[:school],
        last_sign_in: hash_value[:last_sign_in]
      )

      user.define_singleton_method(:number_of_students) do
        hash_value[:number_of_students]
      end

      user.define_singleton_method(:has_valid_subscription) { User.find_by_id(key).subscription_is_valid? }

      user
    end

  end
end
