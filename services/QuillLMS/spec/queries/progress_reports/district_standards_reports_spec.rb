# frozen_string_literal: true

require 'rails_helper'

describe ProgressReports::DistrictStandardsReports do
  let!(:admin) { create(:admin) }
  let(:payload_keys) do
    %w(id name standard_level_name total_activity_count total_student_count proficient_count timespent)
  end

  let(:example_null_json) do
    {
      "schema" => {
        "fields" => []
      },
      "totalRows" => "0",
      "jobComplete" => true
    }
  end

  # standards_report_query(3945512, 7)
  let(:example_json) do
    {
      "kind"=>"bigquery#queryResponse",
      "schema"=>{
        "fields"=>[
          {"name"=>"id", "type"=>"INTEGER", "mode"=>"NULLABLE"},
          {"name"=>"name", "type"=>"STRING", "mode"=>"NULLABLE"},
          {"name"=>"standard_level_name", "type"=>"STRING", "mode"=>"NULLABLE"},
          {"name"=>"total_activity_count", "type"=>"INTEGER", "mode"=>"NULLABLE"},
          {"name"=>"total_student_count", "type"=>"INTEGER", "mode"=>"NULLABLE"},
          {"name"=>"proficient_count", "type"=>"INTEGER", "mode"=>"NULLABLE"},
          {"name"=>"timespent", "type"=>"FLOAT", "mode"=>"NULLABLE"}
        ]
      },
      "jobReference"=>{
        "projectId"=>"analytics-data-stores", "jobId"=>"job_kS-b_Iml8O5mCgYv0soGWRXdxP6d", "location"=>"us-central1"
      },
      "totalRows"=>"1",
      "rows"=>[
        {
          "f"=>[
            {"v"=>"7"},
            {"v"=>"1.1b Use common, proper, and possessive nouns"},
            {"v"=>"CCSS: Grade 1"},
            {"v"=>"1"},
            {"v"=>"82"},
            {"v"=>"82"},
            {"v"=>nil}
          ]
        }
      ],
      "totalBytesProcessed"=>"7817015634",
      "jobComplete"=>true,
      "cacheHit"=>false
    }
  end

  # standards_report_query(3945512, 6)
  let(:example_json2) do
    {
      "kind"=>"bigquery#queryResponse",
      "schema"=>{
        "fields"=>[
          {"name"=>"id", "type"=>"INTEGER", "mode"=>"NULLABLE"},
          {"name"=>"name", "type"=>"STRING", "mode"=>"NULLABLE"},
          {"name"=>"standard_level_name", "type"=>"STRING", "mode"=>"NULLABLE"},
          {"name"=>"total_activity_count", "type"=>"INTEGER", "mode"=>"NULLABLE"},
          {"name"=>"total_student_count", "type"=>"INTEGER", "mode"=>"NULLABLE"},
          {"name"=>"proficient_count", "type"=>"INTEGER", "mode"=>"NULLABLE"},
          {"name"=>"timespent", "type"=>"FLOAT", "mode"=>"NULLABLE"}
        ]
      },
      "jobReference"=>{
        "projectId"=>"analytics-data-stores", "jobId"=>"job_hdxcHeTAbIgInJ5nZvPUwryG853s", "location"=>"us-central1"
      },
        "totalRows"=>"1",
        "rows"=>[
          {
            "f"=>[
              {"v"=>"6"},
              {"v"=>"1.1i Frequently occurring prepositions"},
              {"v"=>"CCSS: Grade 1"}, {"v"=>"4"}, {"v"=>"103"},
              {"v"=>"103"},
              {"v"=>"51010.0"}
            ]
          }
        ],
        "totalBytesProcessed"=>"7823614651",
        "jobComplete"=>true,
        "cacheHit"=>false
    }
  end


  context '#standards_report_query' do
    let(:assigned_student_ids) { [] }

    context 'integration', :external_api do
      it 'tests end to end' do
        expected = [
          {
          "id"=>7,
          "name"=>"1.1b Use common, proper, and possessive nouns",
          "standard_level_name"=>"CCSS: Grade 1",
          "total_activity_count"=>1,
          "total_student_count"=>82,
          "proficient_count"=>82,
          "timespent"=>nil
          }
        ]

        report = described_class.new(admin.id)
        query_result = report.standards_report_query(3945512, 7)
        expect(query_result).to eq expected
      end
    end

    context 'stubbed' do
      it 'should transform stubbed payload correctly' do
        allow(QuillBigQuery::Runner).to receive(:get_response).and_return(example_json)

        report = described_class.new(admin.id)
        query_result = report.standards_report_query(admin.id, 7)

        expected = {
          "id"=>7,
          "name"=>"1.1b Use common, proper, and possessive nouns",
          "standard_level_name"=>"CCSS: Grade 1",
          "total_activity_count"=>1,
          "total_student_count"=>82,
          "proficient_count"=>82,
          "timespent"=>nil
        }

        expect(query_result.count).to eq 1
        expect(query_result.first.keys).to match_array(payload_keys)
        expect(query_result.first).to eq expected
      end
    end
  end

  context '#results' do
    let!(:standard7) { create(:standard, id: 7) }

    it 'should return results in the correct schema' do
      allow(QuillBigQuery::Runner).to receive(:get_response).and_return(example_json)
      report = described_class.new(admin.id)
      allow(report).to receive(:user_ids_query).and_return '3945512'
      results = report.results

      expect(results.is_a?(Array)).to be true
      expect(results.count).to eq 1
      expect(results.first.keys).to match_array(payload_keys)
    end

    it 'should handle multiple standards' do
      create(:standard, id: 6)
      stubbed_payload_sequence = [example_json, example_json2]

      allow(QuillBigQuery::Runner).to receive(:get_response).and_return(*stubbed_payload_sequence)

      report = described_class.new(admin.id)
      allow(report).to receive(:user_ids_query).and_return '3945512'

      results = report.results

      expect(results.pluck('id')).to match_array [6,7]
      expect(results.count).to eq 2
      results.each do |result|
        expect(result.keys).to match_array(payload_keys)
      end
    end

    it 'should handle bigquery responses with null rows' do
      create(:standard, id: 6)
      stubbed_payload_sequence = [example_json, example_null_json]
      allow(QuillBigQuery::Runner).to receive(:get_response).and_return(*stubbed_payload_sequence)

      report = described_class.new(admin.id)
      allow(report).to receive(:user_ids_query).and_return '3945512'

      results = report.results

      expect(results.pluck('id')).to eq [7]
      expect(results.count).to eq 1
    end

  end
end
