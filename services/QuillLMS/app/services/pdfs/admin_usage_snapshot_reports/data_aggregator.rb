# frozen_string_literal: true

module Pdfs
  module AdminUsageSnapshotReports
    class DataAggregator < ApplicationService
      attr_reader :admin_report_filter_selection

      def initialize(admin_report_filter_selection)
        @admin_report_filter_selection = admin_report_filter_selection
      end

      def run
        {
          filter_sections: FilterSectionsBuilder.run(admin_report_filter_selection),
          snapshot_sections: SnapshotSectionsBuilder.run(admin_report_filter_selection)
        }
      end
    end
  end
end
