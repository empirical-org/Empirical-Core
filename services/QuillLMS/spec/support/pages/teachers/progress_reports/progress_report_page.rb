# frozen_string_literal: true

require_relative '../../page'
require_relative '../teachers'

module Teachers
  class ProgressReportPage < Page
    include Rails.application.routes.url_helpers

    def visit
      page.visit(path)
    end

    def column_headers
      table.all('th').map(&:text)
    end

    def export_csv
      find('.export-csv button').click
    end

    def select_filter(filter_class, option_name)
      click_filter_button(filter_class)
      filter_menu_dropdown_option(filter_class, option_name).click
    end

    def filter_by_classroom(classroom_name)
      select_filter('.classroom-filter', classroom_name)
    end

    def table_rows
      rows = table.all('tr').map do |tr|
        tr.all('td').map(&:text)
      end
      rows.shift # Ignore the header row
      rows
    end

    def table
      find('table')
    end

    private def click_filter_button(filter_class)
      find("#{filter_class} button").click
    end

    private def filter_menu_dropdown_option(filter_class, option_name)
      find("#{filter_class} ul.dropdown-menu li", text: option_name)
    end
  end
end
