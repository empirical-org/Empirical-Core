# frozen_string_literal: true

require 'rails_helper'

describe Adapters::Csv::AdminPremiumDataExport do
  subject { described_class }

  describe '#format_cell' do
    it { expect(described_class.format_cell(:completed_at, DateTime.new(2020,1,1))).to eq ('2020-01-01')}
    it { expect(described_class.format_cell(:activity_pack, 'foo')).to eq ('foo')}
    it { expect(described_class.format_cell(:timespent, 61)).to eq (1)}
  end

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
        expected_result = "Student Name,Activity\nTest Student,Test Activity\n"
        expect(subject.to_csv_string(valid_input, [:student_name, :activity_name])).to eq expected_result
      end

      it 'coerces custom columns from strings to symbols' do
        expected_result = "Student Name,Activity\nTest Student,Test Activity\n"
        expect(subject.to_csv_string(valid_input, ['student_name', 'activity_name'])).to eq expected_result
      end
    end

    context 'with invalid input' do
      context 'invalid column selection' do
        let(:invalid_column_selection) { [:student_name, :weird_column] }

        it do
          expect { subject.to_csv_string(valid_input, invalid_column_selection) }.to raise_error(described_class::UnhandledColumnError)
        end
      end

      context 'BigQuery payload lacks the requested columns' do
        let(:payload_missing_columns) { [valid_input.first.reject{|k,v| k == :activity_name}] }

        it do
          expect { subject.to_csv_string(payload_missing_columns) }.to raise_error(described_class::BigQueryResultMissingRequestedColumnError)
        end

      end
    end
  end

end
