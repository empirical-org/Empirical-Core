# Before running this part, make sure that the inconsistent names in this
# spreadsheet are resolved:
# https://docs.google.com/spreadsheets/d/1mSXhH0K_cI3aKY7pbO15qnDciBqomwMAueJmBIni8Zo/edit#gid=1194313690

Lesson.all.each do |lesson|
  activity = Activity.where(:uid=>lesson.uid).first
  if !activity.blank?

    if lesson.lesson_type == Lesson::TYPE_CONNECT_LESSON || lesson.lesson_type == Lesson::TYPE_DIAGNOSTIC_LESSON
      activity.data = lesson.data
    else
      activity.data.merge!(lesson.data)
    end

    activity.save!

  else

    activity = Activity.new(:name=> lesson[:data]["name"], :uid=>lesson.uid, :flags=>[lesson[:data]["flag"]])

    if lesson.lesson_type == Lesson::TYPE_CONNECT_LESSON
      activity.activity_classification_id = 5
      activity.data = lesson.data
    elsif lesson.lesson_type == Lesson::TYPE_DIAGNOSTIC_LESSON
      activity.activity_classification_id = 4
      activity.data = lesson.data
    elsif lesson.lesson_type = Lesson::TYPE_GRAMMAR_ACTIVITY
      activity.name = lesson[:data]["title"]
      activity.activity_classification_id = 2
      activity.data.merge!(lesson.data)
    else
      activity.activity_classification_id = 1
      activity.data.merge!(lesson.data)
    end

    activity.save!

  end
end
