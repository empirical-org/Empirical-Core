# frozen_string_literal: true

require 'rails_helper'

describe ProgressReports::DistrictConceptReports do
  context 'integration', :integration do
    let(:sample_prod_admin_id) { 3737095 }
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
      puts sample_row
      expect(sample_row.keys).to match_array(expected_row_keys)

      %w(school_name teacher_name classroom_name).each do |key|
        expect(sample_row[key].is_a?(String)).to be true
      end
      QuillBigQuery::FLOAT_FIELDS.each do |key|
        expect(sample_row[key].is_a?(Float)).to be true
      end

    end
  end

end
