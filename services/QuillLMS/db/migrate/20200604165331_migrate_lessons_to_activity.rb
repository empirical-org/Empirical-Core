class MigrateLessonsToActivity < ActiveRecord::Migration
  def change
    # Before running this part, make sure that the inconsistent names in this
    # spreadsheet are resolved:
    # https://docs.google.com/spreadsheets/d/1mSXhH0K_cI3aKY7pbO15qnDciBqomwMAueJmBIni8Zo/edit#gid=1194313690

    Lesson.all.each do |lesson|
      activity = Activity.find_by(uid: lesson.uid)
      if activity.blank?
        activity = Activity.new(:name=> lesson[:data]["name"], :uid=>lesson.uid, :flags=>[lesson[:data]["flag"]])

        if lesson.lesson_type == Lesson::TYPE_CONNECT_LESSON
          activity.activity_classification_id = 5
        elsif lesson.lesson_type == Lesson::TYPE_DIAGNOSTIC_LESSON
          activity.activity_classification_id = 4
        elsif lesson.lesson_type == Lesson::TYPE_GRAMMAR_ACTIVITY
          activity.name = lesson[:data]["title"]
          activity.activity_classification_id = 2
        else
          activity.activity_classification_id = 1
        end
      end

      activity.data = lesson.data
      activity.save!

    end

  end
end
