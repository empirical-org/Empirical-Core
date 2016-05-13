namespace :demo do
  desc 'make demo accounts'
  task :create, [:name] => :environment do |t, args|
    # to use this call rake demo:create["firstname lastname"]
    name = args[:name] ? args[:name].to_s : nil
    DemoCreator::create_demo(name)
  end

  task :destroy, [:id_as_string] => :environment do |t, args|
    # must pass argument of id as string since it comes through as a symbol,
    # then convert it back to a string, and finally into an integer
    id = args[:id_as_string] ? args[:id_as_string].to_s.to_i : User.find_by_username('cool-demo').id
    teacher = User.find(id)
    classrooms = teacher.classrooms_i_teach
    classroom_activities = classrooms.map(&:classroom_activities).flatten
    students = classrooms.map(&:students).flatten
    ass = students.map(&:activity_sessions).flatten
    crs = ass.map(&:concept_results).flatten

    teacher.destroy
    classrooms.map(&:destroy)
    classroom_activities.map(&:destroy)
    students.map(&:destroy)
    ass.map(&:destroy)
    crs.map(&:destroy)
  end

  module DemoCreator

    def self.create_demo(name)
      classrooms = self.create_classrooms(name)
      units = self.create_and_assign_units classrooms
      self.create_score_distribution(classrooms, units)
      self.create_concept_results(classrooms)
    end

    def self.create_concept_results(classrooms)
      crs = Demo::ConceptResults.create_from_classrooms(classrooms)
    end

    def self.create_classrooms(name = nil)
      if name
        # can't have whitespace in email/password
        no_whitespace_name = name.split(' ').join('').downcase
      else
        no_whitespace_name = 'demo'
      end
      teacher = User.find_by_email("hello+#{no_whitespace_name}@quill.org")
      if teacher.nil?
        teacher = User.create(role: "teacher", name: (name || 'Mrs. King'), username: (name || 'cool-demo'), email: "hello+#{no_whitespace_name}@quill.org", password: no_whitespace_name, password_confirmation: no_whitespace_name)
      end
      classrooms = self.classrooms_data.map.with_index{|c, index| self.create_classroom(c, teacher, index, no_whitespace_name)}
    end

    def self.create_classroom data, teacher, index, name
      classroom = Classroom.find_by(teacher: teacher, name: data[:name])
      if classroom.nil?
        classroom = Classroom.create name: data[:name], teacher: teacher, code: "#{name}-#{index}", grade: '3'
      end
      students = self.create_students classroom, data[:student_names]
      classroom
    end

    def self.create_students classroom, student_names
      students = student_names.map{|student_name| self.create_student(classroom, student_name)}
    end

    def self.create_student classroom, name
      extant = classroom.students.find_by name: name
      return extant if extant.present?
      student = User.find_by name: name, role: 'student', classcode: classroom.code
      if student.nil?
        student = User.create(name: name, username: "#{name}@#{classroom.code}", role: 'student', classcode: classroom.code, password: 'pwd', password_confirmation: 'pwd')
        student.save
      end
      StudentsClassrooms.create(student_id: student.id, classroom_id: classroom.id)
      student
    end

    def self.create_and_assign_units classrooms
      units = units_data.map{|u| self.create_and_assign_unit(u, classrooms)}
    end

    def self.create_and_assign_unit unit_data, classrooms
      ca = classrooms.map(&:classroom_activities).flatten.compact.first
      if ca.nil? or ca.unit.nil?
        unit = Unit.create(name: unit_data[:name])
      else
        unit = ca.unit
      end

      unit_data[:activity_names].each do |activity_name|
        activity = Activity.find_by_name activity_name
        next if activity.nil?
        classrooms.each do |classroom|
          # after_create callback for classroom_activity will create the desired activity_sessions for students
          # due dates are randomly generated dates in the month of march
          extant_ca = ClassroomActivity.find_by unit: unit, classroom: classroom, activity: activity
          if extant_ca.present?
            ca.activity_sessions.destroy_all
            ca.destroy
          end
          ca = ClassroomActivity.create unit: unit, classroom: classroom, activity: activity, due_date: self.random_due_date
        end
      end
    end

    def self.random_due_date
      min_date = Time.parse '2015-03-01'
      max_date = Time.parse '2015-03-31'
      x = (max_date.to_f - min_date.to_f)*rand + min_date.to_f
      date = Time.at(x).to_date
      date
    end

    def self.create_score_distribution classrooms, units
      self.create_default_score_distribution classrooms
      self.create_special_score_distribution classrooms

    end

    def self.create_default_score_distribution classrooms
      classrooms.each{|c| self.create_default_score_distribution_for_classroom c}
    end

    def self.create_default_score_distribution_for_classroom classroom
      ratios = {
        green: 0.7,
        yellow: 0.2,
        red: 0.1
      }

      ass = classroom.students.map(&:activity_sessions).flatten

      ass.each{|as| as.update_attributes(state: 'finished', completed_at: Time.now, is_final_score: true)}

      self.score_town ratios, ass

      ass.each do |as|
        if as.percentage.nil? then as.update_attributes(percentage: self.random_green_score) end
      end

    end

    def self.score_town ratios, population
      population = population.shuffle
      actual = self.create_actual_distribution_from_ratios ratios, population.size
      records = {}
      actual.each do |key, value|
        last ||= 0
        next_last = last + value - 1
        x = population[last..next_last]
        last = next_last + 1
        records[key] = x
      end

      records[:green].each{|as| as.update_attributes(percentage: self.random_green_score)}
      records[:yellow].each{|as| as.update_attributes(percentage: self.random_yellow_score)}
      records[:red].each{|as| as.update_attributes(percentage: self.random_red_score)}
    end

    def self.create_special_score_distribution classrooms
      special_students = self.special_student_score_distribution classrooms
      self.special_lesson_score_distribution classrooms, special_students
    end

    def self.special_student_score_distribution classrooms
      special_students = classrooms.map{|c| self.special_student_score_distribution_for_classroom(c)}.flatten
      special_students
    end

    def self.special_student_score_distribution_for_classroom classroom
      students = classroom.students.shuffle
      special_students_group1 = students[0..1]
      special_students_group2 = students[2..5]
      if classroom.name == 'First Period'
        special_students_group3 = students[6..7]
      elsif classroom.name == 'Second Period'
        special_students_group3 = students[6..6]
      elsif classroom.name == 'Third Period'
        special_students_group3 = []
      end
      special_students_group1.each{|s1| self.special_scores_student_group1(s1)}
      special_students_group2.each{|s2| self.special_scores_student_group2(s2)}
      special_students_group3.each{|s3| self.special_scores_student_group3(s3)}
      special_students = special_students_group1.concat(special_students_group2).concat(special_students_group3)
      special_students
    end

    def self.special_scores_student_group1 student
      ratios = {
        green: 0.10,
        yellow: 0.55,
        red: 0.35
      }
      ass = student.activity_sessions
      self.score_town ratios, ass
    end

    def self.special_scores_student_group2 student
      ratios = {
        green: 1.0,
        yellow: 0.0,
        red: 0.0
      }
      ass = student.activity_sessions
      ass.each{|as| as.update_attributes(percentage: self.random_green_score)}
    end

    def self.special_scores_student_group3 student
      ratios = {
        green: 0.00,
        yellow: 0.05,
        red: 0.95
      }
      ass = student.activity_sessions
      self.score_town ratios, ass
    end

    def self.special_lesson_score_distribution classrooms, special_students
      # avoid affecting the scores of the special students
=begin
      Special Lesson Score Distribution:
  (none of these should be proofreading lessons)
  (so activity_classification_id should be 2)
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

      x = (activities.length) -1
      y = (activities.count*0.5).ceil
      z = y + 1

      special_activities1 = activities[0..y]
      special_activities2 = activities[z..x]

      students = classrooms.map(&:students).flatten
      not_special_students = students - special_students

      special_activities1.each{|sa1| self.special_scores_activity_group1(sa1, not_special_students)}
      special_activities2.each{|sa2| self.special_scores_activity_group2(sa2, not_special_students)} unless (special_activities2.nil? or special_activities2.empty?)
    end

    def self.special_scores_activity_group1 activity, not_special_students
        ratios = {
          green: 0.95,
          yellow: 0.05,
          red: 0.00
        }

        ass = ActivitySession.where(user: not_special_students)
                             .where(activity: activity)

        self.score_town ratios, ass
    end

    def self.special_scores_activity_group2 activity, not_special_students
        ratios = {
          green: 0.20,
          yellow: 0.60,
          red: 0.20
        }
        ass = ActivitySession.where(user: not_special_students)
                              .where(activity: activity)

        self.score_town ratios, ass
    end

    def self.create_actual_distribution_from_ratios ratios, population_size
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

    def self.random_green_score
      self.random_score 0.76, 1.00
    end

    def self.random_yellow_score
      self.random_score 0.50, 0.75
    end

    def self.random_red_score
      self.random_score 0.00, 0.49
    end

    def self.random_score min, max
      score = min + ((max - min)*rand)
      score
    end

    # DATA

    def self.classrooms_data
        [
          {
            name: 'First Period',
            student_names:
              %w(
                Bill\ Bryson
                Margaret\ Atwood
                Jane\ Austen
                Anton\ Chekhov
                Charles\ Dickens
                Fyodor\ Dostoevsky
                William\ Faulkner
                Laura\ Esquivel
                Ernest\ Hemingway
              )
          },
          {
            name: 'Second Period',
            student_names:
                %w(
                  Gustave\ Flaubert
                  James\ Joyce
                  Harper\ Lee
                  Toni\ Morrison
                  Vladimir\ Nabokov
                  Dougas\ Adams
                  Isabel\ Allende
                  Maya\ Angelou
                  Kazuo\ Ishiguro
                )
          },
          {
            name: 'Third Period',
            student_names:
              %w(
                  J.K.\ Rowling
                  William\ Shakespeare
                  Zadie\ Smith
                  Leo\ Tolstoy
                  Virginia\ Woolf
                  Agathy\ Christie
                  Beveryly\ Cleary
                  Rita\ Dove
                  Langston\ Hughes
                )
          }
        ]
    end

    def self.units_data
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
end
