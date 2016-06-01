module CleverIntegration::Creators::Classrooms

  def self.run(array)
    classrooms = array.map do |ele|
      self.create_classroom(ele)
    end
    classrooms
  end

  def self.create_classroom(data)
    puts "Creating Clever Classroom: #{data[:clever_id]}"
    c = Classroom.unscoped.find_or_initialize_by(clever_id: data[:clever_id])
    c.update(name: data[:name],
             grade: data[:grade])
    c.reload
  end
end
