class ProgressReports::Standards::ClassroomSerializer  < ActiveModel::Serializer
  attributes :name,
             :total_student_count,
             :proficient_student_count,
             :near_proficient_student_count,
             :not_proficient_student_count

             # :students_href,
             # :standards_href
             # :total_standard_count
end