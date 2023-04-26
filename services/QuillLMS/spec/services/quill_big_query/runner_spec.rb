# frozen_string_literal: true

require 'rails_helper'

describe QuillBigQuery::Runner do

  describe '#transform_response' do
    # corresponds to query: select name, created_at from lms.users LIMIT 2
    let(:bigquery_response) do
      {
        "kind"=>"bigquery#queryResponse",
        "schema"=> {
          "fields"=>[
            {"name"=>"name", "type"=>"STRING", "mode"=>"NULLABLE"},
            {"name"=>"created_at", "type"=>"DATETIME", "mode"=>"NULLABLE"}
          ]
        },
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

    context 'BigQuery response contains no rows' do
      let(:no_rows_bigquery_response) { bigquery_response.merge({ 'totalRows' => "0" }) }
      it 'should return early' do
        allow(QuillBigQuery::Transformer).to receive(:new).exactly(0).times
        QuillBigQuery::Runner.transform_response(no_rows_bigquery_response)
      end
    end

    context 'inoperable BigQuey response schema' do
      context 'job is not completed' do
        let(:job_not_completed_response) { {'jobComplete' => false } }
        it 'should raise JobNotCompleted' do
          expect do
            QuillBigQuery::Runner.transform_response(job_not_completed_response)
          end.to raise_error(QuillBigQuery::Runner::JobNotCompletedError)
        end
      end

      context 'jobComplete field is missing' do
        let(:jobcomplete_missing_bigquery_response) { {} }
        it 'should raise JobNotCompleted' do
          expect do
            QuillBigQuery::Runner.transform_response(jobcomplete_missing_bigquery_response)
          end.to raise_error(QuillBigQuery::Runner::JobNotCompletedError)
        end
      end
    end

    context 'invalid BigQuery response schema' do
      let(:invalid_response) { { foo: 1 } }
      let(:another_invalid_response) do
        {
          "schema" => {
            "fields" => 42
          },
          "jobComplete" => true
        }
      end

      it 'should raise UnsupportedSchemaError' do
        expect { QuillBigQuery::Runner.transform_response(another_invalid_response)}.to raise_error(QuillBigQuery::Runner::UnsupportedSchemaError)
      end
    end

    it 'should transform' do
      expected_transformation = [
        {"name"=>"Scarlet Melo", "created_at"=>"2021-07-08T13:18:35.009894"},
        {"name"=>"Demo Teacher", "created_at"=>"2022-09-21T16:49:54.054296"}
      ]

      expect(QuillBigQuery::Runner.transform_response(bigquery_response)).to eq expected_transformation
    end

  end
end
