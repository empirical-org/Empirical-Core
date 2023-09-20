# frozen_string_literal: true

module Evidence
  class BlahFetcher < ApplicationService
    def run
      ['Name', 'model_external_id', 'model_endpoint_id']
    end
  end
end