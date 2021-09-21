class MigrateLessonsToActivity < ActiveRecord::Migration[4.2]
  def change
    # Before running this part, make sure that the inconsistent names in this
    # spreadsheet are resolved:
    # https://docs.google.com/spreadsheets/d/1mSXhH0K_cI3aKY7pbO15qnDciBqomwMAueJmBIni8Zo/edit#gid=1194313690
    lessons_to_archive = [
                          '-KSIwNNwPar51hq9bNIw',
                          '-LJ_F7B64Mn4YtIRE-Sk',
                          '-LKldebIl3TApTzAWgBM',
                          '-KKxoMfLSawnlMtZUXC6',
                          '-LKldaleWFYhQN2eVJ7T',
                          '-KW_2fEvZBJB3GKYpzK2'
                        ]
    lessons_to_alpha = [
                         '-LKldZKSHx3hP9_2Vv5v',
                         '-LKldYuOrBMBpfujBbjg',
                         '-LKld_Wf0lzgNnEvY5aA'
                       ]

    if defined?(Lesson)
      Lesson.where(uid: lessons_to_archive).each do |lesson|
        lesson[:data]["flag"] = "archived"
        lesson.save!
      end

      Lesson.where(uid: lessons_to_alpha).each do |lesson|
        lesson[:data]["flag"] = "alpha"
        lesson.save!
      end

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

          if lesson[:data]["flag"] == "archived"
            activity.flags = ["archived"]
          elsif lesson[:data]["flag"] == "alpha"
            activity.flags = ["alpha"]
          end
        end

        activity.data = lesson.data
        activity.save! if !lesson[:data]["flag"].blank?

      end
    end

    Activity.where(:data=> nil).each do |a|
      data = {}
      data["flag"] = a.flags[0]
      a.data = data
      a.save!
    end

  end
end
