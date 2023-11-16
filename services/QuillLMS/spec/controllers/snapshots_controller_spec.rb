# frozen_string_literal: true

require 'rails_helper'

describe SnapshotsController, type: :controller do
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
    let(:school_ids) { [school.id.to_s] }
    let(:controller_actions) {
      [
        [:count, 'active-classrooms'],
        [:top_x, 'most-active-schools'],
        [:data_export, 'data-export']
      ]
    }
    let(:previous_start) { now - 1.day }
    let(:previous_end) { current_start }
    let(:current_start) { now }
    let(:current_end) { now + 1.day }
    let(:previous_timeframe) { [previous_start, previous_end] }
    let(:current_timeframe) { [current_start, current_end] }
    let(:timeframes) { current_timeframe }

    before do
      allow(DateTime).to receive(:current).and_return(now)
    end

    describe '#create_csv_report_download' do
      let(:query) { 'create_csv_report_download' }
      let(:grades) { ['Kindergarten', '1'] }
      let(:teacher_ids) { ['4', '5'] }
      let(:classroom_ids) { ['7', '8'] }
      let(:headers_to_display) { %w(student_name student_email) }

      before do
        allow(Snapshots::Timeframes).to receive(:calculate_timeframes).and_return(timeframes)
      end

      it 'should trigger PremiumDownloadReportsWorker with correct payload' do
        expected_worker_params = [
          'create_csv_report_download',
          user.id,
          {
            name: timeframe_name,
            timeframe_start: current_start,
            timeframe_end: current_end
          },
          school_ids,
          headers_to_display,
          {
            grades: grades,
            teacher_ids: teacher_ids,
            classroom_ids: classroom_ids
          }
        ]

        expect(Snapshots::PremiumDownloadReportsWorker).to receive(:perform_async).with(*expected_worker_params)

        post :create_csv_report_download, params: {
          query:,
          timeframe: timeframe_name,
          school_ids:,
          grades:,
          teacher_ids:,
          headers_to_display:,
          classroom_ids:
        }
      end
    end

    context 'cache key generation' do
      let(:query) { 'most-active-schools' }
      let(:grades) { ['Kindergarten', '1'] }
      let(:teacher_ids) { ['4', '5'] }
      let(:classroom_ids) { ['7', '8'] }

      before do
        allow(Snapshots::Timeframes).to receive(:calculate_timeframes).and_return(timeframes)
      end

      it do
        expect(Snapshots::CacheKeys).to receive(:generate_key).with(
          query,
          timeframe_name,
          current_start,
          current_end,
          school_ids,
          additional_filters: {
            grades: grades,
            teacher_ids: teacher_ids,
            classroom_ids: classroom_ids
          })

        get :top_x, params: { query: query, timeframe: timeframe_name, school_ids: school_ids, grades: grades, teacher_ids: teacher_ids, classroom_ids: classroom_ids }
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
          get action, params: { query: query_name, timeframe: timeframe_name, school_ids: school_ids }

          json_response = JSON.parse(response.body)

          expect(json_response).to eq(expected_response)
        end
      end

      it 'should fine if a cached top_x query is "[]"' do
        cache_payload = []
        expected_response = { "results" => cache_payload }

        expect(Rails.cache).to receive(:read).once.with(cache_key).and_return(cache_payload)

        get :top_x, params: { query: 'most-active-schools', timeframe: timeframe_name, school_ids: school_ids }

        json_response = JSON.parse(response.body)

        expect(json_response).to eq(expected_response)
      end

      context 'authentication' do
        it 'should return a 403 if the current_user is not an admin for all of the school_ids provided' do
          school2 = create(:school)
          expanded_school_ids = school_ids + [school2.id.to_s]

          controller_actions.each do |action, query_name|
            get action, params: { query: query_name, timeframe: timeframe_name, school_ids: expanded_school_ids }

            expect(response.status).to eq(403)
          end
        end
      end

      context 'param validation' do
        it 'should 400 if the timeframe param is not provided' do
          controller_actions.each do |action, query_name|
            get action, params: { query: query_name, school_ids: school_ids }

            expect(response.status).to eq(400)
          end
        end

        it 'should 400 if the timeframe param is not from the TIMEFRAME list' do
          controller_actions.each do |action, query_name|
            get action, params: { query: query_name, timeframe: 'INVALID_TIMEFRAME', school_ids: school_ids }

            expect(response.status).to eq(400)
          end
        end

        it 'should 400 if the school_ids param is not provided' do
          controller_actions.each do |action, query_name|
            get action, params: { query: query_name, timeframe: timeframe_name }

            expect(response.status).to eq(400)
          end
        end

        it 'should 400 if the school_ids param is empty' do
          controller_actions.each do |action, query_name|
            get action, params: { query: query_name, timeframe: timeframe_name, school_ids: [] }

            expect(response.status).to eq(400)
          end
        end

        it 'should 400 if the query name provided is not valid for the endpoint' do
          controller_actions.each do |action, _|
            get action, params: { query: 'INVALID_QUERY_NAME', timeframe: timeframe_name, school_ids: [] }

            expect(response.status).to eq(400)
          end
        end
      end

      context 'param variation' do
        let(:previous_start) { 'PREVIOUS_TIMEFRAME' }
        let(:previous_end) { 'PREVIOUS_END' }
        let(:current_start) { 'CURRENT_TIMEFRAME' }
        let(:current_end) { 'TIMEFRAME_END' }
        let(:query) { 'active-classrooms' }
        let(:previous_timeframe_flag) { nil }
        let(:custom_start) { nil }
        let(:custom_end) { nil }
        let(:grades) { nil }
        let(:teacher_ids) { nil }
        let(:classroom_ids) { nil }
        let(:expected_worker_params) do
          [
            cache_key,
            query,
            user.id,
            {
              name: timeframe_name,
              timeframe_start: current_start,
              timeframe_end: current_end,
              custom_start: custom_start&.to_s,
              custom_end: custom_end&.to_s
            },
            school_ids,
            {
              grades:,
              teacher_ids:,
              classroom_ids:
            },
            previous_timeframe_flag
          ]
        end

        it 'should trigger a job to cache data if the cache is empty for counts' do
          allow(Snapshots::Timeframes).to receive(:calculate_timeframes).and_return(timeframes)
          expect(Rails.cache).to receive(:read).with(cache_key).and_return(nil)
          expect(Snapshots::CacheSnapshotCountWorker).to receive(:perform_async).with(*expected_worker_params)

          get :count, params: { query:, timeframe: timeframe_name, school_ids: }

          json_response = JSON.parse(response.body)

          expect(json_response).to eq("message" => "Generating snapshot")
        end

        context 'previous_timeframe param is true' do
          let(:previous_timeframe_flag) { "true" }
          let(:current_start) { previous_start }
          let(:current_end) { previous_end }

          it 'should trigger a job to cache data if the cache is empty for previous_counts' do
            allow(Snapshots::Timeframes).to receive(:calculate_timeframes).and_return(previous_timeframe)
            expect(Rails.cache).to receive(:read).with(cache_key).and_return(nil)
            expect(Snapshots::CacheSnapshotCountWorker).to receive(:perform_async).with(*expected_worker_params)

            get :count, params: { query:, timeframe: timeframe_name, school_ids:, previous_timeframe: previous_timeframe_flag}

            json_response = JSON.parse(response.body)

            expect(json_response).to eq("message" => "Generating snapshot")
          end
        end

        context 'all-time timeframe' do
          let(:query_name) { 'active-classrooms' }
          let(:timeframe_name) { 'all-time' }

          it 'previous_count should return nil without having to check cache' do
            expect(Rails.cache).not_to receive(:read)
            expect(Snapshots::CacheSnapshotCountWorker).not_to receive(:perform_async)

            get :count, params: { query: query_name, timeframe: timeframe_name, school_ids: school_ids, previous_timeframe: true }

            json_response = JSON.parse(response.body)

            expect(json_response).to eq("count" => nil)
          end
        end

        context 'most-active-schools query for TopX' do
          let(:query) { 'most-active-schools' }

          it 'should trigger a job to cache data if the cache is empty for top_x' do
            allow(Snapshots::Timeframes).to receive(:calculate_timeframes).and_return(timeframes)
            expect(Rails.cache).to receive(:read).with(cache_key).and_return(nil)
            expect(Snapshots::CacheSnapshotTopXWorker).to receive(:perform_async).with(*expected_worker_params)

            get :top_x, params: { query:, timeframe: timeframe_name, school_ids: }

            json_response = JSON.parse(response.body)

            expect(json_response).to eq("message" => "Generating snapshot")
          end
        end

        context 'data-export query for DataExport' do
          let(:query) { 'data-export' }

          it 'should trigger a job to cache data if the cache is empty for data_export' do
            allow(Snapshots::Timeframes).to receive(:calculate_timeframes).and_return(timeframes)
            expect(Rails.cache).to receive(:read).with(cache_key).and_return(nil)
            expect(Snapshots::CachePremiumReportsWorker).to receive(:perform_async).with(*expected_worker_params)

            get :data_export, params: { query:, timeframe: timeframe_name, school_ids: }

            json_response = JSON.parse(response.body)

            expect(json_response).to eq("message" => "Generating snapshot")
          end
        end

        context 'school_ids and grades specified' do
          let(:query) { 'active-classrooms' }
          let(:grades) { ["Kindergarten", "1", "2"] }
          let(:teacher_ids) { ['3', '4'] }
          let(:classroom_ids) { ['5', '6', '7'] }

          it 'should include school_ids and grades in the call to the cache worker if they are in params' do

            allow(Snapshots::Timeframes).to receive(:calculate_timeframes).and_return(timeframes)
            expect(Rails.cache).to receive(:read).with(cache_key).and_return(nil)
            expect(Snapshots::CacheSnapshotCountWorker).to receive(:perform_async).with(*expected_worker_params)

            get :count, params: { query:, timeframe: timeframe_name, school_ids:, grades:, teacher_ids:, classroom_ids: }
          end
        end

        context 'custom timeframe calculation' do
          let(:query) { 'active-classrooms' }
          let(:timeframe_name) { 'custom' }
          let(:custom_end) { DateTime.now.change(usec: 0) }
          let(:timeframe_length) { 3.days }
          let(:custom_start) { custom_end - timeframe_length }
          let(:current_start) { custom_start }
          let(:current_end) { custom_end }

          it 'should properly calculate custom timeframes' do
            expect(Rails.cache).to receive(:read).with(cache_key).and_return(nil)
            expect(Snapshots::CacheSnapshotCountWorker).to receive(:perform_async).with(*expected_worker_params)

            get :count, params: { query:, timeframe: timeframe_name, timeframe_custom_start: custom_start.to_s, timeframe_custom_end: custom_end.to_s, school_ids: }
          end
        end
      end
    end
  end

  context "#options" do
    let(:target_grade) { '1' }
    let(:teacher) { create(:teacher, school: school) }
    let(:classroom) { create(:classroom, grade: target_grade) }
    let(:teacher_role) { ClassroomsTeacher::ROLE_TYPES[:owner] }
    let!(:classrooms_teacher) { create(:classrooms_teacher, user: teacher, classroom: classroom, role: teacher_role) }

    context "#options with initial load" do
      let(:initial_load) { 'true' }

      let(:other_school) { create(:school) }
      let!(:schools_admins) { create(:schools_admins, school: other_school, user: user )}
      let(:other_teacher) { create(:teacher, school: other_school) }
      let(:other_classroom) { create(:classroom, grade: target_grade) }
      let!(:other_classrooms_teacher) { create(:classrooms_teacher, user: other_teacher, classroom: other_classroom, role: 'owner') }

      it 'should include all schools when initial load is true, regardless of any filters applied' do
        get :options, params: { is_initial_load: initial_load, school_ids: [school.id] }

        json_response = JSON.parse(response.body)

        expect(json_response['all_schools'].map { |s| s["id"] }).to include(school.id, other_school.id)
      end

      it 'should include all teachers when initial load is true, regardless of any filters applied' do
        get :options, params: { is_initial_load: initial_load, school_ids: [school.id] }

        json_response = JSON.parse(response.body)

        expect(json_response['all_teachers'].map { |t| t["id"] }).to include(teacher.id, other_teacher.id)
      end

      it 'should include all classrooms when initial load is true, regardless of any filters applied' do
        get :options, params: { is_initial_load: initial_load, school_ids: [school.id] }

        json_response = JSON.parse(response.body)

        expect(json_response['all_classrooms'].map { |c| c["id"] }).to include(classroom.id, other_classroom.id)
      end
    end


    it 'should return all valid timeframe options with names' do
      get :options

      json_response = JSON.parse(response.body)

      expect(json_response['timeframes']).to eq(Snapshots::Timeframes.frontend_options.map(&:stringify_keys))
    end

    it 'should return a list of all schools and their ids tied to the current_user' do
      get :options

      json_response = JSON.parse(response.body)

      expect(json_response['schools']).to eq([{"id" => school.id, "name" => school.name}])
    end

    it 'should return a static list of grade options' do
      get :options

      json_response = JSON.parse(response.body)

      expect(json_response['grades']).to eq(controller.class::GRADE_OPTIONS.map(&:stringify_keys))
    end

    it 'should return a list of all teachers and their ids tied to the current_user' do
      get :options

      json_response = JSON.parse(response.body)

      expect(json_response['teachers']).to eq([{"id" => teacher.id, "name" => teacher.name}])
    end

    context 'teachers with no classrooms' do
      subject { get :options }

      let(:json_response) { JSON.parse(response.body) }

      before do
        classrooms_teacher.destroy
      end

      it do
        subject
        expect(json_response['teachers']).to eq([])
      end
    end

    context 'teachers who are coteachers' do
      subject { get :options }

      let(:json_response) { JSON.parse(response.body) }
      let(:teacher_role) { ClassroomsTeacher::ROLE_TYPES[:coteacher] }

      it do
        subject
        expect(json_response['teachers']).to eq([])
      end
    end

    it 'should return a list of all classrooms and their ids tied to the current_user' do
      get :options

      json_response = JSON.parse(response.body)

      expect(json_response['classrooms']).to eq([{"id" => classroom.id, "name" => classroom.name}])
    end

    context 'classrooms with visible = false' do
      let(:classroom) { create(:classroom, grade: target_grade, visible: false) }
      let(:result) { JSON.parse(response.body) }

      before do
        get :options
      end

      it { expect(result['teachers']).to eq([{"id" => teacher.id, "name" => teacher.name}]) }
      it { expect(result['classrooms']).to eq([{"id" => classroom.id, "name" => classroom.name}]) }
    end

    context 'teachers in multiple classrooms' do
      let(:classroom2) { create(:classroom, grade: target_grade) }
      let!(:classrooms_teacher2) { create(:classrooms_teacher, user: teacher, classroom: classroom2, role: 'owner') }

      it 'should only list a teacher once even if they have multiple classrooms' do
        get :options

        json_response = JSON.parse(response.body)

        expect(json_response['teachers'].length).to eq(1)
      end
    end

    context 'classrooms with multiple teachers' do
      let(:co_teacher) { create(:teacher, school: school) }
      let!(:classrooms_teacher2) { create(:classrooms_teacher, user: co_teacher, classroom: classroom, role: 'coteacher') }

      it 'should only list each classroom once' do
        get :options

        json_response = JSON.parse(response.body)

        expect(json_response['classrooms'].length).to eq(1)
      end
    end

    context 'teacher sorting' do
      let(:teacher_names) { ['Alice', 'Carol', 'Bob'] }
      let(:new_school) { create(:school) }
      let(:user) { create(:user, administered_schools: [new_school]) }
      let(:teachers) { teacher_names.map { |name| create(:teacher, name: name, school: new_school) } }
      let(:classrooms) { create_list(:classroom, teachers.length, grade: target_grade) }
      let!(:classrooms_teachers) { teachers.map.with_index { |teacher, i| create(:classrooms_teacher, user: teacher, classroom: classrooms[i], role: 'owner') } }

      it 'should sort teachers by name' do
        get :options

        json_response = JSON.parse(response.body)

        expect(json_response['teachers'].map{ |t| t['name'] }).to eq(teacher_names.sort)
      end
    end

    context 'params' do
      let(:excluded_school_id) { school.id + 1 }
      let(:excluded_grade) { '2' }
      let(:excluded_teacher_id) { teacher.id + 1 }

      it 'exclude teachers and classrooms from other schools' do
        get :options, params: { school_ids: [excluded_school_id] }

        json_response = JSON.parse(response.body)

        expect(json_response['teachers']).to eq([])
        expect(json_response['classrooms']).to eq([])
      end

      it 'should pass grades param through to filters' do
        get :options, params: { grades: [excluded_grade] }

        json_response = JSON.parse(response.body)

        expect(json_response['teachers']).to eq([])
        expect(json_response['classrooms']).to eq([])
      end

      it 'should pass teacher_ids param through to filters' do
        get :options, params: { teacher_ids: [excluded_teacher_id] }

        json_response = JSON.parse(response.body)

        expect(json_response['classrooms']).to eq([])
      end

      context '"null" in grade params' do
        let(:target_grade) { nil }

        it 'should match teachers who teach nil grade classrooms' do

          get :options, params: { grades: ["null"] }

          json_response = JSON.parse(response.body)

          expect(json_response['teachers']).to eq([{"id" => teacher.id, "name" => teacher.name}])
        end
      end
    end
  end
end
