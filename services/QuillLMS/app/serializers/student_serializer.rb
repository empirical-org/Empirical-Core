class StudentSerializer < UserSerializer

  has_one :teacher, serializer: TeacherSerializer

end
