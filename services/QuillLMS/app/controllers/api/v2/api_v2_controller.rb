class Api::V2::ApiV2Controller < ActionController::Base
  skip_before_action :verify_authenticity_token

  rescue_from ActiveRecord::RecordNotFound do
    not_found
  end

  protected def auth_staff
    return render(plain: 'Only available to authorized "staff" users', status: :forbidden) unless current_user.try(:staff?)
  end

  protected def not_found
    render(plain: '', status: :not_found)
  end

  protected def invalid_params(invalid_obj)
    render(json: invalid_obj.errors, status: :unprocessable_entity)
  end
end
