# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class DatasetsController < ApplicationController
        def show = @dataset = Dataset.find(params[:id])
      end
    end
  end
end
