# frozen_string_literal: true

module Auth
  class CanvasController < ApplicationController
    skip_before_action :verify_authenticity_token, only: :lti_landing_page

    def canvas
      redirect_to root_path
    end
  end
end
