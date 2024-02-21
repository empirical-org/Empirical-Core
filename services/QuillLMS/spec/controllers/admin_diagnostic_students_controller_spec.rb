# frozen_string_literal: true

require 'rails_helper'

describe AdminDiagnosticStudentsController, type: :controller do
  let(:school) { create(:school) }
  let(:user) { create(:user, administered_schools: [school]) }

  before do
    allow(controller).to receive(:current_user).and_return(user)
  end

  context "#actions" do
    let(:cache_key) { 'CACHE_KEY' }
    let(:timeframe_name) { 'last-30-days' }
    let(:now) { DateTime.current }
    let(:current_snapshot_stub) { 'CURRENT' }
    let(:previous_snapshot_stub) { 'PREVIOUS' }
    let(:diagnostic_id) { '1663' }
    let(:school_ids) { [school.id.to_s] }
    let(:controller_actions) {
      [
        [:report, 'diagnostic-students']
      ]
    }
    let(:query_name) { 'diagnostic-students' }
    let(:previous_start) { now - 1.day }
    let(:previous_end) { current_start }
    let(:current_start) { now }
    let(:current_end) { now + 1.day }
    let(:previous_timeframe) { [previous_start, previous_end] }
    let(:current_timeframe) { [current_start, current_end] }
    let(:timeframes) { current_timeframe }

    let(:json_response) { JSON.parse(response.body) }

    before do
      allow(DateTime).to receive(:current).and_return(now)
    end

    context 'cache key generation' do
      let(:grades) { ['Kindergarten', '1'] }
      let(:teacher_ids) { ['4', '5'] }
      let(:classroom_ids) { ['7', '8'] }

      before do
        allow(Snapshots::Timeframes).to receive(:calculate_timeframes).and_return(timeframes)
      end

      it do
        expect(Snapshots::CacheKeys).to receive(:generate_key).with(
          described_class::CACHE_REPORT_NAME,
          "#{query_name}-#{diagnostic_id}",
          timeframe_name,
          current_start,
          current_end,
          school_ids,
          additional_filters: {
            grades: grades,
            teacher_ids: teacher_ids,
            classroom_ids: classroom_ids
          })

        post :report, params: { query: query_name, diagnostic_id:, timeframe: timeframe_name, school_ids: school_ids, grades: grades, teacher_ids: teacher_ids, classroom_ids: classroom_ids }
      end
    end

    context 'stub caching logic' do
      before do
        allow(controller).to receive(:cache_key_for_timeframe).and_return(cache_key)
      end

      it 'should return the value in the cache assigned to the `results` key if it is available for all actions' do
        cache_payload = {
          "current" => "CURRENT",
          "previous" => "PREVIOUS"
        }
        expected_response = { "results" => cache_payload }

        expect(Rails.cache).to receive(:read).exactly(controller_actions.length).times.with(cache_key).and_return(cache_payload)

        controller_actions.each do |action, query_name|
          post action, params: { query: query_name, timeframe: timeframe_name, diagnostic_id:, school_ids: school_ids }

          json_response = JSON.parse(response.body)

          expect(json_response).to eq(expected_response)
        end
      end

      context 'authentication' do
        it 'should return a 403 if the current_user is not an admin for all of the school_ids provided' do
          school2 = create(:school)
          expanded_school_ids = school_ids + [school2.id.to_s]

          controller_actions.each do |action, query_name|
            post action, params: { query: query_name, timeframe: timeframe_name, diagnostic_id:, school_ids: expanded_school_ids }

            expect(response.status).to eq(403)
          end
        end
      end

      context 'param validation' do
        it 'should 400 if the timeframe param is not provided' do
          controller_actions.each do |action, query_name|
            post action, params: { query: query_name, school_ids: school_ids }

            expect(response.status).to eq(400)
            expect(json_response['error']).to eq('timeframe must be present and valid')
          end
        end

        it 'should 400 if the timeframe param is not from the TIMEFRAME list' do
          controller_actions.each do |action, query_name|
            post action, params: { query: query_name, timeframe: 'INVALID_TIMEFRAME', school_ids: school_ids }

            expect(response.status).to eq(400)
            expect(json_response['error']).to eq('timeframe must be present and valid')
          end
        end

        it 'should 400 if the school_ids param is not provided' do
          controller_actions.each do |action, query_name|
            post action, params: { query: query_name, timeframe: timeframe_name }

            expect(response.status).to eq(400)
            expect(json_response['error']).to eq('school_ids are required')
          end
        end

        it 'should 400 if the school_ids param is empty' do
          controller_actions.each do |action, query_name|
            post action, params: { query: query_name, timeframe: timeframe_name, school_ids: [] }

            expect(response.status).to eq(400)
            expect(json_response['error']).to eq('school_ids are required')
          end
        end

        it 'should 400 if the query name provided is not valid for the endpoint' do
          controller_actions.each do |action, _|
            post action, params: { query: 'INVALID_QUERY_NAME', timeframe: timeframe_name, diagnostic_id:, school_ids: [1] }

            expect(response.status).to eq(400)
            expect(json_response['error']).to eq('unrecognized query type for this endpoint')
          end
        end
      end

      context 'param variation' do
        let(:previous_start) { 'PREVIOUS_TIMEFRAME' }
        let(:previous_end) { 'PREVIOUS_END' }
        let(:current_start) { 'CURRENT_TIMEFRAME' }
        let(:current_end) { 'TIMEFRAME_END' }

        it 'should trigger a job to cache data if the cache is empty for counts' do
          allow(Snapshots::Timeframes).to receive(:calculate_timeframes).and_return(timeframes)
          expect(Rails.cache).to receive(:read).with(cache_key).and_return(nil)
          expect(AdminDiagnosticReports::DiagnosticStudentsWorker).to receive(:perform_async).with(cache_key,
            query_name,
            diagnostic_id,
            user.id,
            {
              name: timeframe_name,
              timeframe_start: current_start,
              timeframe_end: current_end
            },
            school_ids,
            {
              grades: nil,
              teacher_ids: nil,
              classroom_ids: nil
            })

          post :report, params: { query: query_name, diagnostic_id:, timeframe: timeframe_name, school_ids: school_ids }

          json_response = JSON.parse(response.body)

          expect(json_response).to eq("message" => "Generating snapshot")
        end

        it 'should include school_ids and grades in the call to the cache worker if they are in params' do
          grades = ["Kindergarten", "1", "2"]
          teacher_ids = ['3', '4']
          classroom_ids = ['5', '6', '7']

          allow(Snapshots::Timeframes).to receive(:calculate_timeframes).and_return(timeframes)
          expect(Rails.cache).to receive(:read).with(cache_key).and_return(nil)
          expect(AdminDiagnosticReports::DiagnosticStudentsWorker).to receive(:perform_async).with(cache_key,
            query_name,
            diagnostic_id,
            user.id,
            {
              name: timeframe_name,
              timeframe_start: current_start,
              timeframe_end: current_end
            },
            school_ids,
            {
              grades: grades,
              teacher_ids: teacher_ids,
              classroom_ids: classroom_ids
            })

          post :report, params: { query: query_name, diagnostic_id:, timeframe: timeframe_name, school_ids: school_ids, grades: grades, teacher_ids: teacher_ids, classroom_ids: classroom_ids }
        end

        it 'should properly calculate custom timeframes' do
          timeframe_name = 'custom'
          current_end = DateTime.now.change(usec: 0)
          timeframe_length = 3.days
          current_start = current_end - timeframe_length

          expect(Rails.cache).to receive(:read).with(cache_key).and_return(nil)
          expect(AdminDiagnosticReports::DiagnosticStudentsWorker).to receive(:perform_async).with(cache_key,
            query_name,
            diagnostic_id,
            user.id,
            {
              name: timeframe_name,
              timeframe_start: current_start,
              timeframe_end: current_end
            },
            school_ids,
            {
              grades: nil,
              teacher_ids: nil,
              classroom_ids: nil
            })

          post :report, params: { query: query_name, diagnostic_id:, timeframe: timeframe_name, timeframe_custom_start: current_start.to_s, timeframe_custom_end: current_end.to_s, school_ids: school_ids }
        end
      end
    end
  end
end
