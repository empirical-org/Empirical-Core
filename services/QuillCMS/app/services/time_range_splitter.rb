class TimeRangeSplitter < ApplicationService
  attr_reader :start_time, :end_time, :num_parts

  def initialize(start_time, end_time, num_parts)
    @start_time = start_time
    @end_time = end_time
    @num_parts = num_parts
  end

  def run
    total_duration = end_time - start_time
    part_duration = total_duration / num_parts

    parts = []
    current_start = start_time
    num_parts.times do
      current_end = current_start + part_duration
      parts << (current_start...current_end)
      current_start = current_end
    end

    parts
  end
end
