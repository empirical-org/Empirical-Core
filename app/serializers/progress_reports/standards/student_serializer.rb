class ProgressReports::Standards::StudentSerializer < ActiveModel::Serializer
  attributes :name,
             :total_standard_count,
             :proficient_standard_count,
             :near_proficient_standard_count,
             :not_proficient_standard_count,
             :total_activity_count,
             :average_score
end