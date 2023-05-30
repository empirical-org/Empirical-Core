# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe ActiveClassroomsQuery do
    include_context 'Snapshot Query Params'

    around do |example|
      VCR.configure { |c| c.allow_http_connections_when_no_cassette = true }
      example.run
      VCR.configure { |c| c.allow_http_connections_when_no_cassette = false }
    end

    context 'external_api' do
      let(:big_query_runner) { QuillBigQuery::Runner }

      # BigQuery doesn't support CTE aliases with period in the name, so we need to remove the `lms.` prefix from 'FROM' and 'JOIN' clauses
      let(:query) { ActiveClassroomsQuery.new("", "", []).query.gsub(/(FROM|JOIN) lms\.(\w+)/, '\1 \2') }

      let(:num_classrooms) { 2 }
      let!(:classrooms) { create_list(:classroom, num_classrooms) }
      let(:classrooms_teachers) { classrooms.map(&:reload).map(&:classrooms_teachers).flatten }

      let!(:classrooms_data) { data_helper(classrooms) }

      let!(:classrooms_teachers_data) { data_helper(ClassroomsTeacher.all) }

      let(:cte_query) do
        <<-SQL
          WITH
            classrooms AS ( #{classrooms_data} ),
            classrooms_teachers AS ( #{classrooms_teachers_data} )
          #{query}
        SQL
      end

      let(:actual_results) { big_query_runner.execute(cte_query) }

      let(:expected_results) do
        [
          {
            'classrooms_count' => classrooms.count,
            'classrooms_teachers_count' => classrooms_teachers.count
          }
        ]
      end

      it 'should successfully get data' do
        puts cte_query
        expect(actual_results).to eq expected_results
      end
    end

    def data_helper(records)
      records
        .map { |record| record.attributes.except('order') }
        .map { |attrs| [:SELECT, attrs.map { |k, v| "'#{v}' AS #{k}" }.join(', ')].join(' ') }
        .join(" UNION ALL \n")
    end
  end
end
