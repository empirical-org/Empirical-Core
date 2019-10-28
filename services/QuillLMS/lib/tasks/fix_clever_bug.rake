require "csv"

namespace :clever_bug do
  desc 'fix clever bug'
  task :fix => :environment do
    CleverBugFixer::fix
  end

  module CleverBugFixer

    def self.fix
      file = File.expand_path('../original_students_with_classrooms.csv', __FILE__)
      csv = CSV.parse(File.read(file), :headers => true)
      impacted_students_array = []
      csv.each do |row|
        impacted_students_array.push(row.to_hash)
      end

      impacted_students_array.each do |s|
        extant_id = s['id'].to_i
        original_student_classroom_ids = JSON.parse(s['classroom_ids'])
        keys_needed = ["name", "email", "role", "active", "username", "token", "ip_address", "clever_id", "signed_up_with_google", "send_newsletter", "google_id", "last_sign_in", "last_active", "stripe_customer_id", "flags", "title", "time_zone", "account_type", "post_google_classroom_assignments"]
        new_s = s.select{ |k,_| k.in?(keys_needed) }
        new_student = User.new(new_s)
        new_student.password = new_student.last_name
        if new_student.save
          original_student_students_classrooms = StudentsClassrooms.unscoped.where(classroom_id: original_student_classroom_ids, student_id: extant_id)
          original_student_students_classrooms.update_all(student_id: new_student.id)
          original_student_classroom_units = ClassroomUnit.unscoped.where(classroom_id: original_student_classroom_ids)
          original_student_classroom_units.each do |cu|
            if cu.assigned_student_ids.include?(extant_id)
              new_assigned_student_ids = cu.assigned_student_ids - [extant_id]
              new_assigned_student_ids.push(new_student.id)
              cu.update_column(:assigned_student_ids, new_assigned_student_ids)
            end
          end
          ActivitySession.unscoped.where(classroom_unit_id: original_student_classroom_units.ids, user_id: extant_id).update_all(user_id: new_student.id)
        else
          puts 'COULD NOT CREATE'
          puts new_student.attributes
        end
      end
    end
  end
end
