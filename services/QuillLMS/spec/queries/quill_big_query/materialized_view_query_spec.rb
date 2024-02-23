# frozen_string_literal: true

require 'rails_helper'

module QuillBigQuery
  describe MaterializedViewQuery do
    subject { query_instance.run }
    let(:query_instance) { test_query.new(runner: runner_fixture) }
    let(:runner_fixture) { double(:execute) }

    context 'materialized view fallback' do
      let(:test_query) do
        Class.new(described_class) do
          def run
            run_query
          end

          def query
            "SELECT * FROM lms.test_name"
          end

          def materialized_views_used
            ['test_view']
          end
        end
      end

      let(:view_name) { 'lms.test_name' }
      let(:view_sql) { 'SELECT 2' }
      let(:materialized_view_fixture) { double(name: view_name, sql: view_sql) }

      before do
        allow(MaterializedView).to receive(:new).with('test_view').and_return(materialized_view_fixture)
      end

      context 'no problems with view' do
        before do
          allow(runner_fixture).to receive(:execute)
        end

        it 'does not dereference materialized views' do
          expect(query_instance).not_to receive(:query_without_materialized_views)

          subject
        end
      end

      context 'view not defined in database' do
        it 'does not dereference materialized views' do
          @times_called = 0
          expect(runner_fixture).to receive(:execute).exactly(2).times do
            @times_called += 1
            raise ::Google::Cloud::NotFoundError, view_name if @times_called == 1
          end
          expect(query_instance).to receive(:query_without_materialized_views).once

          subject
        end
      end

      context 'view not in useable state' do
        it 'does not dereference materialized views' do
          @times_called = 0
          expect(runner_fixture).to receive(:execute).exactly(2).times do
            @times_called += 1
            raise ::Google::Cloud::InvalidArgumentError, view_name if @times_called == 1
          end
          expect(query_instance).to receive(:query_without_materialized_views).once

          subject
        end
      end
    end    
  end
end
