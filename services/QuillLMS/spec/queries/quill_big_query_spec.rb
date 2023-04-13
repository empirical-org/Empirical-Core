# frozen_string_literal: true

require 'rails_helper'

describe QuillBigQuery do
  describe '#floatify_fields' do
    it 'should floatify fields do' do
      input = [{ "correct" => "1", "incorrect" => 2, "percentage" => 3.0, foo: "1" }]
      expected_output = [{ "correct" => 1.0, "incorrect" => 2.0, "percentage" => 3.0, foo: "1" }]
      expect(QuillBigQuery.floatify_fields(input)).to eq expected_output
    end
  end

  describe '#transform_response' do
    # corresponds to query: select name, created_at from lms.users LIMIT 2
    let(:bigquery_response) do
      {
        "kind"=>"bigquery#queryResponse",
        "schema"=> {
        "fields"=>[
          {"name"=>"name", "type"=>"STRING", "mode"=>"NULLABLE"},
          {"name"=>"created_at", "type"=>"DATETIME", "mode"=>"NULLABLE"}
        ]},
        "jobReference"=> {
          "projectId"=>"analytics-data-stores",
          "jobId"=>"job_rnsEGMAIr3Zsx25hDkFm1oDviQ8t",
          "location"=>"us-central1"
        },
        "totalRows"=>"2",
        "rows"=>[
          {"f"=>[{"v"=>"Scarlet Melo"}, {"v"=>"2021-07-08T13:18:35.009894"}]},
          {"f"=>[{"v"=>"Demo Teacher"}, {"v"=>"2022-09-21T16:49:54.054296"}]}
        ],
        "totalBytesProcessed"=>"0",
        "jobComplete"=>true,
        "cacheHit"=>true
      }
    end

    context 'invalid BigQuery response schema' do
      let(:invalid_response) { { foo: 1 } }
      let(:another_invalid_response) do
        {
          "schema" => {
            "fields" => 42
          }
        }
      end

      it 'should raise error' do
        expect { QuillBigQuery.transform_response(invalid_response)}.to raise_error(NoMethodError)
        expect { QuillBigQuery.transform_response(another_invalid_response)}.to raise_error(QuillBigQuery::UnsupportedSchemaError)
      end
    end

    it 'should transform' do
      expected_transformation = [
        {"name"=>"Scarlet Melo", "created_at"=>"2021-07-08T13:18:35.009894"},
        {"name"=>"Demo Teacher", "created_at"=>"2022-09-21T16:49:54.054296"}
      ]

      expect(QuillBigQuery.transform_response(bigquery_response)).to eq expected_transformation
    end
  end
end
