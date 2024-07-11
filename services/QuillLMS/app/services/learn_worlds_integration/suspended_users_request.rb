# frozen_string_literal: true

module LearnWorldsIntegration
  class SuspendedUsersRequest < Request
    MAX_ITEMS_PER_PAGE = 200

    def endpoint = "#{USER_TAGS_ENDPOINT}?status=suspended&items_per_page=#{MAX_ITEMS_PER_PAGE}"

    def run = fetch_ids_to_suspend

    def fetch_page(page_number)
      response = HTTParty.get("#{endpoint}&page=#{page_number}", headers:)

      case response.code
      when 404
        :no_users
      when 200
        response
      else
        raise UnexpectedApiResponse, response.to_s
      end
    end

    def fetch_ids_to_suspend
      initial_page = fetch_page(1)
      return [] if initial_page == :no_users

      total_pages = initial_page.dig('meta', 'totalPages')
      raise UnexpectedApiResponse, 'No totalPages value' unless total_pages&.to_i

      2.upto(total_pages)
        .reduce([]) {|memo, n| memo.concat(fetch_page(n)['data']) }
        .concat(initial_page['data'])
        .compact
        .pluck('id')
    end
  end
end
