# frozen_string_literal: true

module Pdfs
  module AdminUsageSnapshotReportHelper
    ADMINISTRATOR_IMG_SRC_BASE = "#{ENV.fetch('CDN_URL', '')}/images/pages/administrator"
    IMG_SRC_BASE = "#{ADMINISTRATOR_IMG_SRC_BASE}/usage_snapshot_report"

    ICONS_SRC = {
      arrow_up: "#{IMG_SRC_BASE}/arrow_up_icon.svg",
      arrow_down: "#{IMG_SRC_BASE}/arrow_down_icon.svg",
      bulb: "#{IMG_SRC_BASE}/bulb.svg",
      new_tab: "#{ADMINISTRATOR_IMG_SRC_BASE}/new_tab.svg",
      pencil: "#{IMG_SRC_BASE}/pencil.svg",
      school: "#{IMG_SRC_BASE}/school.svg",
      students: "#{IMG_SRC_BASE}/students.svg",
      teacher: "#{IMG_SRC_BASE}/teacher.svg"
    }.freeze

    ICONS_SRC_MAPPING = {
      classrooms: ICONS_SRC[:teacher],
      highlights: ICONS_SRC[:bulb],
      practice: ICONS_SRC[:pencil],
      schools: ICONS_SRC[:school],
      users: ICONS_SRC[:students]
    }

    def change_icon_src(change)
      return if change.nil? || change.zero?

      change.positive? ? ICONS_SRC[:arrow_up] : ICONS_SRC[:arrow_down]
    end

    def new_tab_src
      ICONS_SRC[:new_tab]
    end

    def section_icon_src(section_name)
      ICONS_SRC_MAPPING[section_name]
    end
  end
end
