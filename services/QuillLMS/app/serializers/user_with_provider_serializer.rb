# frozen_string_literal: true

class UserWithProviderSerializer < UserSerializer
  attributes :provider, :user_external_id

  def user_external_id
    canvas_instance = CanvasAuthCredential.find_by(user: object)&.canvas_instance
    object.user_external_id(canvas_instance: canvas_instance)
  end
end
