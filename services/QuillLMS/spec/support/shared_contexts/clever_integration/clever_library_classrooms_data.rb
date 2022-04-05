# frozen_string_literal: true

RSpec.shared_context "Clever Library Classrooms Data" do
  include_context "Clever Library Students Data"

  let(:teacher_clever_id) { "5b2c69d17306d1054bc49f38" }

  let(:classroom1_grade) { "2" }
  let(:classroom1_clever_id) { "5b2c569c7a68e009745801ab" }
  let(:classroom1_name) { "Second grade - Price - " }
  let(:classroom1_students) { [student1_clever_id, student2_clever_id] }

  let(:classroom1_data) do
    {
      "data" => {
        "grade"=> classroom1_grade,
        "id"=> classroom1_clever_id,
        "name"=> classroom1_name,
        "students"=> classroom1_students,
        "subject"=>"english",
        "teacher"=> teacher_clever_id,
        "teachers"=>[teacher_clever_id]
      }
    }
  end

  let(:classroom1_attrs) do
    {
      clever_id: classroom1_clever_id,
      grade: classroom1_grade,
      name: classroom1_name,
      students: classroom1_students
    }
  end

  let(:classroom2_grade) { "4" }
  let(:classroom2_clever_id) { "5b2c569c7a68e009745801ac" }
  let(:classroom2_name) { "Fourth grade - Price - "}
  let(:classroom2_students) { [student3_clever_id] }
  let(:classroom2_teacher_clever_id) { "5b2c69d17306d1054bc49f38" }

  let(:classroom2_data) do
    {
      "data" => {
        "grade"=> classroom2_grade,
        "id"=> classroom2_clever_id,
        "name"=> classroom2_name,
        "students"=> classroom2_students,
        "subject"=>"english",
        "teacher"=> teacher_clever_id,
        "teachers"=>[teacher_clever_id]
      }
    }
  end

  let(:classroom2_attrs) do
    {
      clever_id: classroom2_clever_id,
      grade: classroom2_grade,
      name: classroom2_name,
      students: classroom2_students
    }
  end

  let(:classrooms_data) { { "data"=> [classroom1_data, classroom2_data] } }


  let(:classroom1_students_data) { { "data" => [student1_data, student2_data] } }
  let(:classroom2_students_data) { { "data" => [student3_data] } }
end
