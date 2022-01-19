# frozen_string_literal: true

RSpec.shared_context "Clever District Classrooms Data" do
  include_context "Clever District Students Data"

  let(:teacher_clever_id) { "5b2c69d17306d1054bc49f38" }

  let(:classroom1_grade) { "1" }
  let(:classroom1_clever_id) { "5b2c569c7a68e009745801ab" }
  let(:classroom1_name) { "Second grade - Price - " }
  let(:classroom1_students) { [student1_clever_id, student2_clever_id] }

  let(:classroom1_clever_data) do
    Clever::Section.new(
      course: "6099d1cd519b163",
      created: "2021-04-29T15:21:24.185Z",
      district: "53ea7667720000018",
      grade: classroom1_grade,
      id: classroom1_clever_id,
      last_modified: "2021-12-31T12:01:26.938Z",
      name: classroom1_name,
      period: "2",
      school: "68cdecb17709b8",
      sis_id: "53e76677ed008-68ca239c1ed9",
      students: classroom1_students,
      subject: "english/language arts",
      teacher: teacher_clever_id,
      teachers: [teacher_clever_id],
      term_id: "609969da18f744041320a335"
    )
  end

  let(:classroom1_data) { Clever::SectionResponse.new(data: classroom1_clever_data) }

  let(:classroom1_attrs) do
    {
      clever_id: classroom1_clever_id,
      grade: classroom1_grade,
      name: classroom1_name,
      students: classroom1_students
    }
  end

  let(:classroom1_students_data) { Clever::StudentsResponse.new(data: [student1_data, student2_data]) }

  let(:classroom2_grade) { "4" }
  let(:classroom2_clever_id) { "5b2c569c7a68e009745801ac" }
  let(:classroom2_name) { "Fourth grade - Price - "}
  let(:classroom2_students) { [student3_clever_id] }

  let(:classroom2_clever_data) do
    Clever::Section.new(
      course: "6099d1cd519b163",
      created: "2021-04-29T15:21:24.185Z",
      district: "53ea7667720000018",
      grade: classroom2_grade,
      id: classroom2_clever_id,
      last_modified: "2021-12-31T12:01:26.938Z",
      name: classroom2_name,
      period: "2",
      school: "68cdecb17709b8",
      sis_id: "53e76677ed008-68ca239c1ed9",
      students: classroom2_students,
      subject: "english/language arts",
      teacher: teacher_clever_id,
      teachers: [teacher_clever_id],
      term_id: "609969da18f744041320a335"
    )
  end

  let(:classroom2_data) { Clever::SectionResponse.new(data: classroom2_clever_data) }

  let(:classroom2_attrs) do
    {
      clever_id: classroom2_clever_id,
      grade: classroom2_grade,
      name: classroom2_name,
      students: classroom2_students
    }
  end

  let(:classroom2_students_data) { Clever::StudentsResponse.new(data: [student3_data]) }

  let(:classrooms_data) { Clever::SectionsResponse.new(data: [classroom1_data, classroom2_data]) }
end
