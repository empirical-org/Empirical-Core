# frozen_string_literal: true

module Snapshots
  describe CacheKeys do
    let(:user_id) { 123 }
    let(:query) { 'active-classrooms' }
    let(:previous_timeframe_start) { DateTime.current.end_of_day - 61.days }
    let(:current_timeframe_start) { DateTime.current.end_of_day - 31.days }
    let(:timeframe_end) { DateTime.current.end_of_day - 1.day }
    let(:school_ids) { [1,2,3] }
    let(:grades) { ['Kindergarten',1,2,3,4] }
    let(:teacher_ids) { [4,5,6] }
    let(:classroom_ids) { [7,8,9] }
    let(:additional_filters) do
      {
        grades: grades,
        teacher_ids: teacher_ids,
        classroom_ids: classroom_ids
      }
    end

    context '#generate_key' do
      it 'should compile a valid cache key' do
        expect(Snapshots::CacheKeys.generate_key(query,
          previous_timeframe_start,
          current_timeframe_start,
          timeframe_end,
          school_ids,
          additional_filters: additional_filters)
        ).to eq([
          "admin-snapshot",
          query,
          previous_timeframe_start,
          current_timeframe_start,
          timeframe_end,
          "school-ids-#{school_ids.sort.join('-')}",
          "grades-#{grades.map(&:to_s).sort.join('-')}",
          "teacher-ids-#{teacher_ids.sort.join('-')}",
          "classroom-ids-#{classroom_ids.sort.join('-')}"
        ])
      end

      it 'should compile a valid cache key when there is a custom timeframe' do
        custom_end = DateTime.current
        custom_start = custom_end - 1.day
        calculated_previous_start = custom_start - 1.day

        expect(Snapshots::CacheKeys.generate_key(query,
          calculated_previous_start,
          custom_start,
          custom_end,
          school_ids,
          additional_filters: additional_filters)
        ).to eq([
          "admin-snapshot",
          query,
          calculated_previous_start,
          custom_start,
          custom_end,
          "school-ids-#{school_ids.sort.join('-')}",
          "grades-#{grades.map(&:to_s).sort.join('-')}",
          "teacher-ids-#{teacher_ids.sort.join('-')}",
          "classroom-ids-#{classroom_ids.sort.join('-')}"
        ])
      end

      it 'should generate the same cache key when arrays are in different orders' do
        expect(Snapshots::CacheKeys.generate_key(query,
          previous_timeframe_start,
          current_timeframe_start,
          timeframe_end,
          school_ids,
          additional_filters: additional_filters)
        ).to eq(Snapshots::CacheKeys.generate_key(query,
          previous_timeframe_start,
          current_timeframe_start,
          timeframe_end,
          school_ids.reverse,
          additional_filters: {
            grades: grades.reverse,
            teacher_ids: teacher_ids.reverse,
            classroom_ids: classroom_ids.reverse
          }))
      end
    end
  end
end
