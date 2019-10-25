require "csv"

namespace :clever_bug do
  desc 'fix clever bug'
  task :fix => :environment do
    CleverBugFixer::fix
  end

  module CleverBugFixer

    def self.fix
      file = File.expand_path('../original_students.csv', __FILE__)
      csv = CSV.parse(File.read(file), :headers => true)
      impacted_students_array = []
      csv.each do |row|
        impacted_students_array.push(row.to_hash)
      end

      impacted_students_array.each do |s|
        extant_id = s['id']
        new_s = s
        new_s['id'] = nil
        new_s['created_at'] = nil
        new_s['updated_at'] = nil
        new_student = User.create(new_s)
        if new_student && new_student.id
          clever_s = User.find_by_id(extant_id)
          non_clever_classroom_ids = clever_s.classrooms.where(clever_id: nil).ids
          non_clever_students_classrooms = StudentsClassrooms.where(classroom_id: non_clever_classroom_ids, student_id: clever_s)
          non_clever_students_classrooms.update_all(student_id: new_student.id)
          non_clever_classroom_units = ClassroomUnit.where(classroom_id: non_clever_classroom_ids)
          non_clever_classroom_units.each do |cu|
            if cu.assigned_student_ids.include?(clever_s.id)
              new_assigned_student_ids = cu.assigned_student_ids - [clever_s.id]
              new_assigned_student_ids.push(new_student.id)
              cu.update(assigned_student_ids: new_assigned_student_ids)
            end
          end
          ActivitySession.where(classroom_unit_id: non_clever_classroom_units.ids, user_id: clever_s.id).update_all(user_id: new_student.id)
        else
          puts 'COULD NOT CREATE'
          puts new_s
        end
      end
    end
  end
end
