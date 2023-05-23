# frozen_string_literal: true

module Snapshots
  describe CacheKeys do
    let(:user_id) { 123 }
    let(:query) { 'active-classrooms' }
    let(:timeframe_name) { 'last-30-days' }
    let(:school_ids) { [1,2,3] }
    let(:grades) { ['Kindergarten',1,2,3,4] }

    context '#generate_key' do
      it 'should compile a valid cache key' do
        expect(Snapshots::CacheKeys.generate_key(query,
          user_id,
          { name:  timeframe_name },
          school_ids,
          grades)
        ).to eq([
          "admin-snapshot",
          query,
          timeframe_name,
          "school-ids-#{school_ids.sort.join('-')}",
          "grades-#{grades.map(&:to_s).sort.join('-')}",
          user_id
        ])
      end

      it 'should compile a valid cache key when there is a custom timeframe' do
        custom_end = Date.today
        custom_start = custom_end - 1.day

        expect(Snapshots::CacheKeys.generate_key(query,
          user_id,
          {
            name: Snapshots::CacheKeys::CUSTOM_TIMEFRAME_NAME,
            custom_start: custom_start,
            custom_end: custom_end
          },
          school_ids,
          grades)
        ).to eq([
          "admin-snapshot",
          query,
          "#{Snapshots::CacheKeys::CUSTOM_TIMEFRAME_NAME}-#{custom_start}-#{custom_end}",
          "school-ids-#{school_ids.sort.join('-')}",
          "grades-#{grades.map(&:to_s).sort.join('-')}",
          user_id
        ])
      end

      it 'should generate the same cache key when arrays are in different orders' do
        expect(Snapshots::CacheKeys.generate_key(query,
          user_id,
          { name: timeframe_name },
          school_ids,
          grades)
        ).to eq(Snapshots::CacheKeys.generate_key(query,
          user_id,
          { name: timeframe_name },
          school_ids.reverse,
          grades.reverse))
      end
    end
  end
end
