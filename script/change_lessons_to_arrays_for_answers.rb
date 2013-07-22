Lesson.all.each do |l|
  unless l.body.is_a? Array
    l.body = [l.body]
    l.save!
  end

  puts l.reload.body.inspect
end