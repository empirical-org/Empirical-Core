# frozen_string_literal: true

module CleverAuthable
  extend ActiveSupport::Concern

  def clever_link
    "https://clever.com/oauth/authorize?#{clever_link_query_params}"
  end

  def clever_link_query_params
    {
      response_type: 'code',
      redirect_uri: clever_link_redirect_uri,
      client_id: Clever::CLIENT_ID,
      scope: QuillClever.scope
    }.to_param
  end

  def clever_link_redirect_uri
    Clever::REDIRECT_URL
  end
end
