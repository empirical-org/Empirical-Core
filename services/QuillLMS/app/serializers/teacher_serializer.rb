# frozen_string_literal: true

class TeacherSerializer < UserSerializer

  has_many :classrooms

end
