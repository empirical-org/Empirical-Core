class ProgressReports::Standards::ClassroomSerializer  < ActiveModel::Serializer
  attributes :name,
             :total_student_count,
             :proficient_student_count,
             :near_proficient_student_count,
             :not_proficient_student_count,
             :total_standard_count

             # :students_href,
             # :standards_href

  def total_standard_count
    object.unique_topic_count
  end
end