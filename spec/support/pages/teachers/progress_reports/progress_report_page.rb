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

    def table
      find('table')
    end
  end
end
