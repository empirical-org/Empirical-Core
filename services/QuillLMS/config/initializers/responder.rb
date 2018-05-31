class ActionController::Responder
  def to_html
    default_render
  rescue ActionView::MissingTemplate => e
    navigation_behavior(e)
  end

  def api_behavior error
    raise error unless resourceful?

    if get?
      display resource
    elsif post?
      display resource, status: :created
    elsif put?
      display resource, status: :ok
    else
      head :no_content
    end
  end
end
