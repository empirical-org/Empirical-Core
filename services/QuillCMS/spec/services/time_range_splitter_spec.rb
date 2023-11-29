require "rails_helper"

RSpec.describe TimeRangeSplitter do
  let(:start_time) { Time.now }
  let(:end_time) { start_time + 3600 } # 1 hour later
  let(:num_parts) { 4 }
  subject { TimeRangeSplitter.run(start_time, end_time, num_parts) }

  describe '#run' do
    it 'returns the correct number of parts' do
      expect(subject.size).to eq(num_parts)
    end

    it 'splits the range into equal parts' do
      subject.each_cons(2) do |first_range, second_range|
        expect(second_range.end - second_range.begin).to eq(first_range.end - first_range.begin)
        expect(second_range.begin - first_range.begin).to eq(first_range.end - first_range.begin)
      end
    end

    it 'covers the entire range' do
      expect(subject.first.begin).to eq(start_time)
      expect(subject.last.end).to eq(end_time)
    end
  end
end
