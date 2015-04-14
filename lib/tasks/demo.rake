namespace :demo do
  desc 'make demo accounts'
  task :create => :environment do

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
      teacher = User.create role: 'teacher', name: 'Ms. Chavez', password: 'pwd', password_confirmation: 'pwd'
      classrooms = classrooms_data.map{|c| create_classroom(c, teacher)}
    end

    def create_classroom data, teacher
      classroom = Classroom.find_by_name data[:name]
      classroom_name = classroom.present? ? "#{data[:name]} Demo" : data[:name]
      classroom = Classroom.create name: classroom_name, teacher: teacher, code: 'fast-tree'
      students = create_students classroom.code, data[:student_names]
      classroom
    end

    def create_students classroom_code, student_names
      students = student_names.map{|student_name| create_student(classroom_code, student_name)}
    end

    def create_student class_code, name
      u = User.new class_code: class_code, name: name, role: 'student', password: 'pwd', password_confirmation: 'pwd'
      u.generate_username
      u.save
      u
    end

    def create_and_assign_units classrooms
      units = units_data.map{|u| create_and_assign_unit(u, classrooms)}
    end

    def create_and_assign_unit unit_data, classrooms
      u = Unit.create name: unit_data[:name]
      unit_data[:activity_names].each do |activity_name|
        activity = Activity.find_by_name activity_name
        classrooms.each do |classroom|
          # after_create callback for classroom_activity will create the desired activity_sessions for students
          u.classroom_activities.create classroom: classroom, activity: activity, due_date: data[:due_date]
        end
      end
      u
    end

    def create_score_distribution classrooms, units
=begin
    due dates are randomly generated dates in the month of march

    Default Lesson/Student Score Distribution:
      Green: 70%
      Yellow: 20%
      Red: 10%

    Special Lesson Score Distribution:
    (none of these should be proofreading lessons)
      3 Lessons:
      Green 95%
      Yellow: 5%
      2 Lessons
      Green: 20%
      Yellow: 60%
      Red: 20%

    Special Student Score Distribution:
      2 Students Per Class
      10% Green
      55% Yellow
      35% Red
      4 Students Per Class
      100% Green
=end
      create_default_score_distribution

    end

    def create_default_score_distribution classrooms
      students = classrooms.map(&:students).flatten
      students.each{|s| create_default_score_distribution_for_student s}
    end

    def create_defualt_score_distribution_for_student student
      default_distribution = {
        green: 0.7,
        yellow: 0.2,
        red: 0.1
      }

      as = student.activity_sessions

    end


    def random_green_score

    end

    def random_yellow_score

    end

    def random_red_score

    end



    # DATA


    def teacher_name
      'Ms. Chavez'
    end

    def classrooms_data
        [
          {
            name: 'Period 1',
            student_names:
              %w(
                  Sharri Villar
                  Victor Bartos
                  Azni Aslakhanov
                  Damien Newburn
                  Andra Moffatt
                  Ona Scheer
                  Kristy Sanchez
                  Flor Sabino
                  Ritchie Barillas
                  Carl Pittman
                  Lakita Lingenfelter
                  June Oslund
                  Casta Porto
                  Sharri Villar
                  Florida Mescher
                  Jolyn Brosnan
                  Emily Roberts
                  Eunice Phelps
                  Benny Loman
                  Sage Imel
                  Collin Loadholt
                  Sage Imel
                  Carry Adcox
                  Remedios Bermudez
                  Sam Martinez
              )
          },
          {
            name: 'Period 2',
            student_names:
                %w(
                  Pearl Bucholz
                  Margarita Winrow
                  Leticia Villagran
                  Victor Olivas
                  Sherwood Jacobi
                  Edith Yates
                  Dee Davi
                  Ellie Nelson
                  Kathryn Pace
                  Isaac Powers
                  Sara Connor
                  Sean Adkins
                  Lamont Beachy
                  Darby Gossett
                  Gayla Gordillo
                  Zuri Afolayan
                  Hermine Gillett
                  Eloisa Mackey
                  Jane Rogerson
                  Charles Andrews
                  German Mar
                  Leota Kerfien
                  Evie Brannock
                  Dylan Anderson
                  Cristobal Rugh
                  Ralph Patterson
                )
          },
          {
            name: 'Period 3',
            student_names:
              %w(
                  Margarete Woolley
                  Brigid Coppock
                  Macario Palomo
                  Earlean Kuehn
                  Julina Chirino
                  Rea Lubinski
                  Jim Hogan
                  Jerrold Mosso
                  Dantel Lorenz
                  Annmarie Pilling
                  Myrle Bartelt
                  Elisa Villarruel
                  Regina Cain
                  Patric MacIver
                  Serenity White
                  Artura Saucedo
                  Allena Hebron
                  Jose Nichols
                  Antwan Jerrell
                  Chiumbo Afolayan
                  Novia Vicente
                  Kira Wentzel
                  Shona Gable
                  George Richard
                  Tyler Kelly
                  Amos Sylva
                )
          }
        ]
  end

  def units_data
      [
        {
          name: 'Unit 1: Verbs',
          due_date: '',
          activity_names:
            %w(
              Singular and Plural Nouns with Matching Verbs
              We Choose The Moon (History)
              The Progressive Tense
              Change Sentences from Passive to Active
              Change Sentences from Active to Passive
              Recognize and Correct Inappropriate Shifts in Verb Voice and Mood
              Future Tense Verbs
            )
        },
        {
          name: 'Unit 2: Punctuation',
          due_date: '',
          activity_names:
            %w(
              Spaces with Punctuation
              At, In, On (Time)
              At, In, On (Place)
              I've, That's, It's
              Putting the World in Perspective: The Apollo 8 Photograph (History)
              Can't, Won't
              )
        },
        {
          name: 'Unit 3: Commonly Confused Words',
          due_date: '',
          activity_names:
            %w(
              Lose, Loose
              To, Too, Two
              You're, Your
              Than, Then
              It's, Its
              Of, Off
              Ernest Shackleton Escapes the Antarctic (History)
              Their, They're, There
            )
        },
        {
          name: 'Unit 4: End of Year Review',
          due_date: '',
          activity_names:
            %w(
              Singular and Plural Nouns with Matching Verbs
              Change into Proper Passive or Active Sentences
              Putting the World in Perspective: The Apollo 8 Photograph (History)
              At, In, On (Place)
              Ernest Shackleton Escapes the Antarctic (History)
              To, Too, Two
              Their, They're, There
            )
        }
      ]
  end

end