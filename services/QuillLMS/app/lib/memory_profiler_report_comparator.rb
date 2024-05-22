# frozen_string_literal: true

class MemoryProfilerReportComparator < ApplicationService
  include ActionView::Helpers::NumberHelper

  attr_reader :report1, :report2

  def initialize(report1, report2 = nil)
    @report1 = report1
    @report2 = report2
  end

  def run
    if report2.nil?
      {
        memory_allocated: number_to_human_size(report1[:objects_allocated]),
        objects_allocated: number_to_human(report1[:objects_allocated]),
        memory_retained: number_to_human_size(report1[:objects_allocated]),
        objects_retained: number_to_human(report1[:objects_allocated])
      }
    else
      {
        memory_allocated_diff: memory_allocated_diff,
        objects_allocated_diff: objects_allocated_diff,
        memory_retained_diff: memory_retained_diff,
        objects_retained_diff: objects_retained_diff
      }
    end
  end

  private def objects_allocated_diff
    number_to_human(report2[:objects_allocated] - report1[:objects_allocated])
  end

  private def objects_retained_diff
    number_to_human(report2[:objects_retained] - report1[:objects_retained])
  end

  private def memory_allocated_diff
    number_to_human_size(report2[:memory_allocated] - report1[:memory_allocated])
  end

  private def memory_retained_diff
    number_to_human_size(report2[:memory_retained] - report1[:memory_retained])
  end
end
