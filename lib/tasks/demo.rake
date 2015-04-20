namespace :demo do
  desc 'make demo accounts'
  task :create => :environment do
    create_demo
  end

  task :destroy => :environment do
    teacher = User.find_by_username 'demo'
    classrooms = teacher.classrooms
    classroom_activities = classrooms.map(&:classroom_activities).flatten
    students = classrooms.map(&:students).flatten
    ass = students.map(&:activity_sessions).flatten

    teacher.destroy
    classrooms.map(&:destroy)
    classroom_activities.map(&:destroy)
    students.map(&:destroy)
    ass.map(&:destroy)
  end

  def create_demo
    classrooms, units = create_classrooms_and_create_and_assign_units
    create_score_distribution classrooms, units
  end

  def create_classrooms_and_create_and_assign_units
    # all units assigned to all students in all classes
    classrooms = create_classrooms
    units = create_and_assign_units classrooms
    [classrooms, units]
  end

  def create_classrooms
    teacher = User.find_by name: 'Ms. Chavez', username: 'demo', email: 'chavezdemo279@gmail.com', role: 'teacher'
    if teacher.nil?
      teacher = User.create(role: 'teacher', name: 'Ms. Chavez', username: 'demo', email: 'chavezdemo279@gmail.com', password: 'demo', password_confirmation: 'demo')
    end
    classrooms = classrooms_data.map.with_index{|c, index| create_classroom(c, teacher, index)}
  end

  def create_classroom data, teacher, index
    classroom = Classroom.find_or_create_by name: data[:name], teacher: teacher, code: "cool-demo-#{index}", grade: '3'
    students = create_students classroom, data[:student_names]
    classroom
  end

  def create_students classroom, student_names
    students = student_names.map{|student_name| create_student(classroom, student_name)}
  end

  def create_student classroom, name
    extant = classroom.students.find_by name: name
    return extant if extant.present?
    student = User.new(classcode: classroom.code, name: name, role: 'student', password: 'pwd', password_confirmation: 'pwd')
    student.send(:generate_username)
    student.save
    student
  end

  def create_and_assign_units classrooms
    units = units_data.map{|u| create_and_assign_unit(u, classrooms)}
  end

  def create_and_assign_unit unit_data, classrooms
    ca = classrooms.map(&:classroom_activities).flatten.compact.first
    if ca.nil? or ca.unit.nil?
      unit = Unit.create(name: unit_data[:name])
    else
      unit = ca.unit
    end

    unit_data[:activity_names].each do |activity_name|
      activity = Activity.find_by_name activity_name
      classrooms.each do |classroom|
        # after_create callback for classroom_activity will create the desired activity_sessions for students
        # due dates are randomly generated dates in the month of march
        extant_ca = ClassroomActivity.find_by unit: unit, classroom: classroom, activity: activity
        if extant_ca.present?
          ca.activity_sessions.destroy_all
          ca.destroy
        end
        ca = ClassroomActivity.create unit: unit, classroom: classroom, activity: activity, due_date: random_due_date
      end
    end
  end

  def random_due_date
    min_date = Time.parse '2015-03-01'
    max_date = Time.parse '2015-03-31'
    x = (max_date.to_f - min_date.to_f)*rand + min_date.to_f
    date = Time.at(x).to_date
    date
  end

  def create_score_distribution classrooms, units
    create_default_score_distribution classrooms
    create_special_score_distribution classrooms
  end

  def create_default_score_distribution classrooms
    classrooms.each{|c| create_default_score_distribution_for_classroom c}
  end

  def create_default_score_distribution_for_classroom classroom
    ratios = {
      green: 0.7,
      yellow: 0.2,
      red: 0.1
    }

    ass = classroom.students.map(&:activity_sessions).flatten

    ass.each{|as| as.update_attributes(state: 'finished', completed_at: Time.now, is_final_score: true)}

    score_town ratios, ass

    ass.each do |as|
      if as.percentage.nil? then as.update_attributes(percentage: random_green_score) end
    end

  end

  def score_town ratios, population
    population = population.shuffle
    actual = create_actual_distribution_from_ratios ratios, population.size
    records = {}
    actual.each do |key, value|
      last ||= 0
      next_last = last + value - 1
      x = population[last..next_last]
      last = next_last + 1
      records[key] = x
    end

    records[:green].each{|as| as.update_attributes(percentage: random_green_score)}
    records[:yellow].each{|as| as.update_attributes(percentage: random_yellow_score)}
    records[:red].each{|as| as.update_attributes(percentage: random_red_score)}
  end

  def create_special_score_distribution classrooms
    special_students = special_student_score_distribution classrooms
    special_lesson_score_distribution classrooms, special_students
  end

  def special_student_score_distribution classrooms
    special_students = classrooms.map{|c| special_student_score_distribution_for_classroom(c)}.flatten
    special_students
  end

  def special_student_score_distribution_for_classroom classroom
    students = classroom.students.shuffle
    special_students_group1 = students[0..1]
    special_students_group2 = students[2..5]

    if classroom.name == 'Period 1'
      special_students_group3 = students[6..7]
    elsif classroom.name == 'Period 2'
      special_students_group3 = students[6..6]
    elsif classroom.name == 'Period 3'
      special_students_group3 = []
    end

    special_students_group1.each{|s1| special_scores_student_group1(s1)}
    special_students_group2.each{|s2| special_scores_student_group2(s2)}
    special_students_group3.each{|s3| special_scores_student_group3(s3)}


    special_students = special_students_group1.concat(special_students_group2).concat(special_students_group3)
    special_students
  end

  def special_scores_student_group1 student
    ratios = {
      green: 0.10,
      yellow: 0.55,
      red: 0.35
    }
    ass = student.activity_sessions
    score_town ratios, ass
  end

  def special_scores_student_group2 student
    ratios = {
      green: 1.0,
      yellow: 0.0,
      red: 0.0
    }
    ass = student.activity_sessions
    ass.each{|as| as.update_attributes(percentage: random_green_score)}
  end

  def special_scores_student_group3 student
    ratios = {
      green: 0.00,
      yellow: 0.05,
      red: 0.95
    }
    ass = student.activity_sessions
    score_town ratios, ass
  end

  def special_lesson_score_distribution classrooms, special_students
    # avoid affecting the scores of the special students
=begin
      Special Lesson Score Distribution:
  (none of these should be proofreading lessons)
  (so activity_classification_id should be 2 for Practice Questions)
    3 Lessons:
      Green 95%
      Yellow: 5%
    2 Lessons
      Green: 20%
      Yellow: 60%
      Red: 20%
=end
    activities = classrooms.map(&:classroom_activities)
                           .flatten
                           .map(&:activity)
                           .uniq
                           .select{|activity| activity.activity_classification_id == 2}
                           .shuffle

    special_activities1 = activities[0..2]
    special_activities2 = activities[3..4]

    students = classrooms.map(&:students).flatten
    not_special_students = students - special_students

    special_activities1.each{|sa1| special_scores_activity_group1(sa1, not_special_students)}
    special_activities2.each{|sa2| special_scores_activity_group2(sa2, not_special_students)} unless special_activities2.empty?
  end

  def special_scores_activity_group1 activity, not_special_students
      ratios = {
        green: 0.95,
        yellow: 0.05,
        red: 0.00
      }

      ass = ActivitySession.where(user: not_special_students)
                           .where(activity: activity)

      score_town ratios, ass
  end

  def special_scores_activity_group2 activity, not_special_students
      ratios = {
        green: 0.20,
        yellow: 0.60,
        red: 0.20
      }
      ass = ActivitySession.where(user: not_special_students)
                            .where(activity: activity)

      score_town ratios, ass
  end

  def create_actual_distribution_from_ratios ratios, population_size
    actual = {}
    ratios.each do |key, value|
      actual[key] = (population_size*value).floor
    end
    # might have some leftover since weve been taking #floor
    pre_total = actual.values.reduce(:+)
    remnant = population_size - pre_total
    actual[actual.keys.first] += remnant
    actual
  end

  def random_green_score
    random_score 0.76, 1.00
  end

  def random_yellow_score
    random_score 0.50, 0.75
  end

  def random_red_score
    random_score 0.00, 0.49
  end

  def random_score min, max
    score = min + ((max - min)*rand)
    score
  end

  # DATA

  def classrooms_data
      [
        {
          name: 'Period 1',
          student_names:
            %w(
                Sharri\ Villar
                Victor\ Bartos
                Azni\ Aslakhanov
                Damien\ Newburn
                Andra\ Moffatt
                Ona\ Scheer
                Kristy\ Sanchez
                Flor\ Sabino
                Ritchie\ Barillas
                Carl\ Pittman
                Lakita\ Lingenfelter
                June\ Oslund
                Casta\ Porto
                Florida\ Mescher
                Jolyn\ Brosnan
                Emily\ Roberts
                Eunice\ Phelps
                Benny\ Loman
                Sage\ Imel
                Collin\ Loadholt
                Sage\ Imel
                Carry\ Adcox
                Remedios\ Bermudez
                Sam\ Martinez
            )
        },
        {
          name: 'Period 2',
          student_names:
              %w(
                Pearl\ Bucholz
                Margarita\ Winrow
                Leticia\ Villagran
                Victor\ Olivas
                Sherwood\ Jacobi
                Edith\ Yates
                Dee\ Davi
                Ellie\ Nelson
                Kathryn\ Pace
                Isaac\ Powers
                Sara\ Connor
                Sean\ Adkins
                Lamont\ Beachy
                Darby\ Gossett
                Gayla\ Gordillo
                Zuri\ Afolayan
                Hermine\ Gillett
                Eloisa\ Mackey
                Jane\ Rogerson
                Charles\ Andrews
                German\ Mar
                Leota\ Kerfien
                Evie\ Brannock
                Dylan\ Anderson
                Cristobal\ Rugh
                Ralph\ Patterson
              )
        },
        {
          name: 'Period 3',
          student_names:
            %w(
                Margarete\ Woolley
                Brigid\ Coppock
                Macario\ Palomo
                Earlean\ Kuehn
                Julina\ Chirino
                Rea\ Lubinski
                Jim\ Hogan
                Jerrold\ Mosso
                Dantel\ Lorenz
                Annmarie\ Pilling
                Myrle\ Bartelt
                Elisa\ Villarruel
                Regina\ Cain
                Patric\ MacIver
                Serenity\ White
                Artura\ Saucedo
                Allena\ Hebron
                Jose\ Nichols
                Antwan\ Jerrell
                Chiumbo\ Afolayan
                Novia\ Vicente
                Kira\ Wentzel
                Shona\ Gable
                George\ Richard
                Tyler\ Kelly
                Amos\ Sylva
              )
        }
      ]
  end

  def units_data
    # due dates are randomly generated dates in the month of march
    [
      {
        name: 'Unit 1: Verbs',
        activity_names:
          [
            "Singular and Plural Nouns with Matching Verbs",
            "We Choose The Moon (History)",
            "The Progressive Tense",
            "Change Sentences from Passive to Active",
            "Change Sentences from Active to Passive",
            "Recognize and Correct Inappropriate Shifts in Verb Voice and Mood",
            "Future Tense Verbs"
          ]
      },
      {
        name: 'Unit 2: Punctuation',
        activity_names:
          [
            "Spaces with Punctuation",
            "At, In, On (Time)",
            "At, In, On (Place)",
            "I've, That's, It's",
            "Putting the World in Perspective: The Apollo 8 Photograph (History)",
            "Can't, Won't"
          ]
      },
      {
        name: 'Unit 3: Commonly Confused Words',
        activity_names:
          [
            "Lose, Loose",
            "To, Too, Two",
            "You're, Your",
            "Than, Then",
            "It's, Its",
            "Of, Off",
            "Ernest Shackleton Escapes the Antarctic (History)",
            "Their, They're, There"
          ]
      },
      {
        name: 'Unit 4: End of Year Review',
        activity_names:
          [
            "Singular and Plural Nouns with Matching Verbs",
            "Change into Proper Passive or Active Sentences",
            "Putting the World in Perspective: The Apollo 8 Photograph (History)",
            "At, In, On (Place)",
            "Ernest Shackleton Escapes the Antarctic (History)",
            "To, Too, Two",
            "Their, They're, There"
          ]
      }
    ]
  end
end