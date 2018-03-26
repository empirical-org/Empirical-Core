shared_context 'clever' do
  let!(:teacher_response) do
    response = Struct.new(:sections, :school)
    sections = [
      {
        id: 'section_id_1',
        name: 'section1',
        grade: '2'
      }
    ]
    school = {nces_id: school_nces_id}
    response.new(sections, school)
  end

  let!(:section_response) do
    response = Struct.new(:students)
    students = [
      {
        id: 'student_id_1',
        name: {
          first: 'studentjohn',
          last: 'studentsmith'
        },
        email: 'student@gmail.com',
        credentials: {
          district_username: 'student_username'
        }
      }
    ]
    response.new(students)
  end

  def school_nces_id
    'fake_nces_id'
  end

  def helper(response)
    lambda do |clever_id, district_token|
      response
    end
  end

  let!(:requesters) {
    {
      teacher_requester: helper(teacher_response),
      section_requester: helper(section_response)
    }
  }

  def teacher
    User.find_by(clever_id: 'teacher_id_1',
                 name: "Teacherjohn Teachersmith",
                 email: 'teacher@gmail.com',
                 role: 'teacher')
  end

  def classroom
    Classroom.find_by(name: 'section1', clever_id: 'section_id_1')
  end

  def student
    User.find_by(clever_id: 'student_id_1',
                 name: 'Studentjohn Studentsmith',
                 email: 'student@gmail.com',
                 username: 'student_username',
                 role: 'student')
  end

  def school
    School.find_by(nces_id: school_nces_id)
  end
end
