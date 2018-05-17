module Teachers
  def self.path
    '/teachers'
  end

  def self.classroom_path(classroom)
    "#{classrooms_path}/#{classroom.to_param}"
  end

  def self.classrooms_path
    "#{path}/classrooms"
  end
end
