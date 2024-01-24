# frozen_string_literal: true

module Pdfs
  module AdminUsageSnapshotReports
    class DataAggregator < ApplicationService
      attr_reader :admin_report_filter_selection

      delegate :classrooms, :grades, :schools, :teachers, :timeframe_name,
        to: :admin_report_filter_selection

      def initialize(admin_report_filter_selection)
        @admin_report_filter_selection = admin_report_filter_selection
      end

      def run = { filter_sections:, snapshot_sections: }

      private def filter_sections = { classrooms:, grades:, schools:, teachers:, timeframe_name: }
      private def snapshot_sections = SnapshotSectionsBuilder.run(admin_report_filter_selection)
    end
  end
end
