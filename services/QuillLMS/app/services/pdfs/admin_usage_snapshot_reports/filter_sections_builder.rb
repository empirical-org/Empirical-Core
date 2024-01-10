# frozen_string_literal: true

module Pdfs
  module AdminUsageSnapshotReports
    class FilterSectionsBuilder < ApplicationService
      attr_reader :admin_report_filter_selection

      delegate :classrooms, :grades, :schools, :teachers, :timeframe_name,
        to: :admin_report_filter_selection

      def initialize(admin_report_filter_selection)
        @admin_report_filter_selection = admin_report_filter_selection
      end

      def run = { classrooms:, grades:, schools:, teachers:, timeframe_name: }
    end
  end
end
