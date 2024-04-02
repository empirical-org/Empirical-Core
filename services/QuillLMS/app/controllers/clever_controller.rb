# frozen_string_literal: true

class CleverController < ApplicationController
  def auth_url_details
    render json: {
      redirect_uri: Auth::Clever::REDIRECT_URL,
      client_id: Auth::Clever::CLIENT_ID,
      clever_scope: Auth::Clever::SCOPE
    }
  end

  def no_classroom
    render 'clever/no_classroom'
  end

  def district_success
    render 'clever/district_success'
  end
end
