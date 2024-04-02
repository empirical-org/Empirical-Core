# frozen_string_literal: true

class UserWithProviderSerializer < UserSerializer
  attributes :provider, :user_external_id, :school_linked_to_canvas

  def user_external_id
    case object.provider
    when object.class::GOOGLE_PROVIDER then object.google_id
    when object.class::CLEVER_PROVIDER then object.clever_id
    when object.class::CANVAS_PROVIDER
      canvas_instance = CanvasAuthCredential.find_by(user: object)&.canvas_instance
      object.user_external_id(canvas_instance: canvas_instance)
    end
  end

  def school_linked_to_canvas
    object&.school&.canvas_instances&.any?
  end
end
