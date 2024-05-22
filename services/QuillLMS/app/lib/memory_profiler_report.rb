# frozen_string_literal: true

class MemoryProfilerReport < ApplicationService
  attr_reader :report

  def initialize(&block)
    @report = ::MemoryProfiler.report(&block)
  end

  def run
    {
      memory_allocated: memory_allocated,
      objects_allocated: objects_allocated,
      memory_retained: memory_retained,
      objects_retained: objects_retained
    }
  end

  private def objects_allocated
    report.total_allocated
  end

  private def objects_retained
    report.total_retained
  end

  private def memory_allocated
    report.total_allocated_memsize
  end

  private def memory_retained
    report.total_retained_memsize
  end
end
