# frozen_string_literal: true

class StudentSerializer < UserSerializer

  has_one :teacher, serializer: TeacherSerializer

end
