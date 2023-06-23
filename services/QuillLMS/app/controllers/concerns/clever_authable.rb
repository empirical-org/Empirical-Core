# frozen_string_literal: true

module CleverAuthable
  extend ActiveSupport::Concern

  def clever_link
    "https://clever.com/oauth/authorize?#{clever_link_query_params}"
  end

  def clever_link_query_params
    {
      response_type: 'code',
      redirect_uri: Auth::Clever::REDIRECT_URL,
      client_id: Auth::Clever::CLIENT_ID,
      scope: Auth::Clever::SCOPE
    }.to_param
  end
end
