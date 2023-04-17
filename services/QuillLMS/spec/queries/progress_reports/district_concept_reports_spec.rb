# frozen_string_literal: true

require 'rails_helper'

describe ProgressReports::DistrictConceptReports do
  let(:sample_prod_admin_id) { 3737095 }
  context 'stubbed' do
    let(:example_json) do
      {
        "kind"=>"bigquery#queryResponse",
        "schema"=>{
          "fields"=>[
            {"name"=>"school_name", "type"=>"STRING", "mode"=>"NULLABLE"},
            {"name"=>"teacher_name", "type"=>"STRING", "mode"=>"NULLABLE"},
            {"name"=>"classroom_name", "type"=>"STRING", "mode"=>"NULLABLE"},
            {"name"=>"student_name", "type"=>"STRING", "mode"=>"NULLABLE"},
            {"name"=>"correct", "type"=>"INTEGER", "mode"=>"NULLABLE"},
            {"name"=>"incorrect", "type"=>"INTEGER", "mode"=>"NULLABLE"},
            {"name"=>"percentage", "type"=>"FLOAT", "mode"=>"NULLABLE"}
          ]
        },
        "jobReference"=>{
          "projectId"=>"analytics-data-stores",
          "jobId"=>"job_j6wYthiIL6aoz_NQcDLjyYeJLRTu",
          "location"=>"us-central1"
        },
        "totalRows"=>"3",
        "rows"=>[
          {"f"=>[
              {"v"=>"Huntington Park Institute of Applied Medicine"},
              {"v"=>"Yen Shayne Li"}, {"v"=>"Mr. Li's Block 5 Class"},
              {"v"=>"James Hernandez"},
              {"v"=>"479"},
              {"v"=>"300"},
              {"v"=>"61.0"}
            ]
          },
          {"f"=>[
              {"v"=>"Huntington Park Institute of Applied Medicine"},
              {"v"=>"Ariana Pinto"},
              {"v"=>"Block1"},
              {"v"=>"Melina Sosa"},
              {"v"=>"10"},
              {"v"=>"15"},
              {"v"=>"40.0"}
            ]
          },
          {"f"=>[
              {"v"=>"Huntington Park Institute of Applied Medicine"},
              {"v"=>"Jason Suarez"},
              {"v"=>"Mr. Suarez Second Semester Period 1"},
              {"v"=>"Angela Muniz Zavala"},
              {"v"=>"615"},
              {"v"=>"239"},
              {"v"=>"72.0"}
            ]
          }
        ],
        "totalBytesProcessed"=>"26242358705",
        "jobComplete"=>true,
        "cacheHit"=>false
      }
    end

    it 'should transform BigQuery floats and integers to Ruby floats' do
      expected = [
        {
          "school_name"=>"Huntington Park Institute of Applied Medicine",
          "teacher_name"=>"Yen Shayne Li",
          "classroom_name"=>"Mr. Li's Block 5 Class",
          "student_name"=>"James Hernandez",
          "correct"=>479.0,
          "incorrect"=>300.0,
          "percentage"=>61.0
        },
        {
          "school_name"=>"Huntington Park Institute of Applied Medicine",
          "teacher_name"=>"Ariana Pinto",
          "classroom_name"=>"Block1",
          "student_name"=>"Melina Sosa",
          "correct"=>10.0,
          "incorrect"=>15.0,
          "percentage"=>40.0
        },
        {
          "school_name"=>"Huntington Park Institute of Applied Medicine",
          "teacher_name"=>"Jason Suarez",
          "classroom_name"=>"Mr. Suarez Second Semester Period 1",
          "student_name"=>"Angela Muniz Zavala",
          "correct"=>615.0,
          "incorrect"=>239.0,
          "percentage"=>72.0
        }
      ]
      allow(QuillBigQuery::Runner).to receive(:get_response).and_return(example_json)
      results = ProgressReports::DistrictConceptReports.new(sample_prod_admin_id).results
      expect(results).to eq expected
    end
  end

  context 'integration', :external_api do
    let(:expected_row_keys) do
      %w(school_name teacher_name classroom_name student_name correct incorrect percentage)
    end

    around do |a_spec|
      VCR.configure { |c| c.allow_http_connections_when_no_cassette = true }
      a_spec.run
      VCR.configure { |c| c.allow_http_connections_when_no_cassette = false }
    end

    it 'tests end to end' do
      results = ProgressReports::DistrictConceptReports.new(sample_prod_admin_id).results
      sample_row = results.first
      expect(sample_row.keys).to match_array(expected_row_keys)
    end
  end

end
