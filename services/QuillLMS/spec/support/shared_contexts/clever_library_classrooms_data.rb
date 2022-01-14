# frozen_string_literal: true

RSpec.shared_context "Clever Library Classrooms Data" do
  include_context "Clever Library Students Data"

  let(:teacher_clever_id) { "5b2c69d17306d1054bc49f38" }
  let(:another_teacher_clever_id) { "7b2c69d17306d1054bc49f38" }

  let(:classroom1_grade) { "2" }
  let(:classroom1_clever_id) { "5b2c569c7a68e009745801ab" }
  let(:classroom1_name) { "Second grade - ELA" }
  let(:classroom1_students) { [student1_clever_id, student2_clever_id] }

  let(:classroom1_data) do
    {
      "data" => {
        "grade"=> classroom1_grade,
        "id"=> classroom1_clever_id,
        "name"=> classroom1_name,
        "students"=> classroom1_students,
        "subject"=>"english/language_arts",
        "teacher"=> teacher_clever_id,
        "teachers"=>[teacher_clever_id]
      }
    }
  end

  let(:classroom1_attrs) do
    {
      clever_id: classroom1_clever_id,
      coteachers: [teacher_clever_id],
      grade: classroom1_grade,
      name: classroom1_name,
      owner: teacher_clever_id,
      students: classroom1_students
    }
  end

  let(:classroom2_grade) { "4" }
  let(:classroom2_clever_id) { "6b2c569c7a68e009745801ac" }
  let(:classroom2_name) { "Fourth grade - ELA"}
  let(:classroom2_students) { [student3_clever_id] }

  let(:classroom2_data) do
    {
      "data" => {
        "grade"=> classroom2_grade,
        "id"=> classroom2_clever_id,
        "name"=> classroom2_name,
        "students"=> classroom2_students,
        "subject"=>"english/language_arts",
        "teacher"=> teacher_clever_id,
        "teachers"=>[teacher_clever_id, another_teacher_clever_id]
      }
    }
  end

  let(:classroom2_attrs) do
    {
      clever_id: classroom2_clever_id,
      coteachers: [teacher_clever_id, another_teacher_clever_id],
      grade: classroom2_grade,
      name: classroom2_name,
      owner: teacher_clever_id,
      students: classroom2_students
    }
  end

  let(:classrooms_data) { { "data"=> [classroom1_data, classroom2_data] } }

  let(:classroom3_grade) { "5" }
  let(:classroom3_clever_id) { "6b2c569c7a68e009745801ac" }
  let(:classroom3_name) { "Fifth grade - ELA"}
  let(:classroom3_students) { [student3_clever_id] }

  let(:classroom3_data) do
    {
      "data" => {
        "grade"=> classroom3_grade,
        "id"=> classroom3_clever_id,
        "name"=> classroom3_name,
        "students"=> classroom3_students,
        "subject"=>"english",
        "teacher"=> another_teacher_clever_id,
        "teachers"=>[another_teacher_clever_id, teacher_clever_id]
      }
    }
  end

  let(:classroom3_attrs) do
    {
      clever_id: classroom2_clever_id,
      coteachers: [another_teacher_clever_id, teacher_clever_id],
      grade: classroom2_grade,
      name: classroom2_name,
      owner: another_teacher_clever_id,
      students: classroom2_students
    }
  end

  let(:classroom1_students_data) { { "data" => [student1_data, student2_data] } }
  let(:classroom2_students_data) { { "data" => [student3_data] } }
  let(:classroom3_students_data) { { "data" => [student3_data] } }
end
