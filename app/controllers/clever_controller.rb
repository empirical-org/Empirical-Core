class CleverController < ApplicationController
  def auth_url_details
    render json: {
      redirect_uri: Clever::REDIRECT_URL,
      client_id: Clever::CLIENT_ID,
      clever_scope: QuillClever.scope
    }
  end
end
