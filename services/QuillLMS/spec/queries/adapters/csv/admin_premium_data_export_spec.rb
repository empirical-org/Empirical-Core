# frozen_string_literal: true

require 'rails_helper'

describe Adapters::Csv::AdminPremiumDataExport do
  subject { described_class }

  describe '#to_csv_string' do
    let(:valid_input) {
      [{
        activity_name: 'Test Activity',
        activity_pack: 'Test Pack',
        activity_session_id: 12345,
        classroom_grade: '9',
        classroom_id: 67890,
        classroom_name: 'Test Classroom',
        completed_at: Time.current,
        school_name: 'Test School',
        score: 0.95,
        standard: 'Test Standard',
        student_email: 'test@example.com',
        student_id: 112233,
        student_name: 'Test Student',
        teacher_name: 'Test Teacher',
        timespent: 200,
        tool: 'Test Tool'
      }]
    }

    context 'with valid input' do
      it 'returns a CSV string' do
        expect(subject.to_csv_string(valid_input)).to be_a(String)
        expect(subject.to_csv_string(valid_input)).to include('Test Activity')
      end

      it 'handles subsets of valid columns and orders them according to ORDERED_COLUMNS' do
        expected_result = "student_name,activity_name\nTest Student,Test Activity\n"
        expect(subject.to_csv_string(valid_input, [:student_name, :activity_name])).to eq expected_result
      end

      it 'coerces custom columns from strings to symbols' do
        expected_result = "student_name,activity_name\nTest Student,Test Activity\n"
        expect(subject.to_csv_string(valid_input, ['student_name', 'activity_name'])).to eq expected_result
      end
    end

    context 'with invalid input' do
      let(:invalid_input) { valid_input.first.merge(extra_column: 'Extraneous') }

      it 'raises a ColumnMismatchError' do
        expect { subject.to_csv_string([invalid_input]) }.to raise_error(described_class::UnhandledColumnError)
      end
    end
  end


end
