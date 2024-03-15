SELECT
    schools.id as school_id,
    schools.name as school_name,
    classrooms_teachers.user_id as teacher_id,
    users.name as teacher_name,
    classrooms.id as classroom_id,
    classrooms.name AS classroom_name,
    classrooms.grade as grade
  FROM lms.schools
  INNER JOIN lms.schools_users ON schools.id = schools_users.school_id
  INNER JOIN lms.classrooms_teachers ON schools_users.user_id = classrooms_teachers.user_id
  INNER JOIN lms.classrooms ON classrooms_teachers.classroom_id = classrooms.id
  INNER JOIN lms.users on users.id = classrooms_teachers.user_id
  WHERE classrooms_teachers.role = 'owner' 
