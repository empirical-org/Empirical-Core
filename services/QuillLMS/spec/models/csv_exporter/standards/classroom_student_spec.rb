require 'rails_helper'

describe CsvExporter::Standards::ClassroomStudent do
  include_context 'Standard Progress Report'
  # it_behaves_like 'CSV Exporter' do
  #   let(:expected_header_row) {
  #     [
  #       'Page Title',
  #       'Student',
  #       'Standards',
  #       'Proficient Standards',
  #       'Not Yet Proficient Standards',
  #       'Activities',
  #       'Average',
  #       'Overall Mastery Status'
  #     ]
  #   }

  #   let(:filters) { { classroom_id: full_classroom.id } }
  #
  #   let(:model_instance) {
  #     ProgressReports::Standards::Student.new(teacher).results({}).first
  #   }
  #
  #   let(:expected_data_row) {
  #     [
  #       "Standards by Student: #{full_classroom.name}",
  #       model_instance.name,
  #       model_instance.total_standard_count,
  #       model_instance.proficient_standard_count,
  #       model_instance.not_proficient_standard_count,
  #       model_instance.total_activity_count,
  #       model_instance.average_score,
  #       'Proficient'
  #     ]
  #   }
  #
  #   let(:expected_model_data_size) {
  #     visible_students.size
  #   }
  # end
end
