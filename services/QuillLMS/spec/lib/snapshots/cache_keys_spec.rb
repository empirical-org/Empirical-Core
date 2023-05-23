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
        expect(Snapshots::CacheKeys.generate_key(query, user_id, timeframe_name, school_ids, grades)).to eq([
          "admin-snapshot",
          query,
          timeframe_name,
          "school-ids-#{school_ids.sort.join('-')}",
          "grades-#{grades.map(&:to_s).sort.join('-')}",
          user_id
        ])
      end

      it 'should generate the same cache key when arrays are in different orders' do
        expect(Snapshots::CacheKeys.generate_key(query,
          user_id,
          timeframe_name,
          school_ids,
          grades)
        ).to eq(Snapshots::CacheKeys.generate_key(query,
          user_id,
          timeframe_name,
          school_ids.reverse,
          grades.reverse))
      end
    end
  end
end
