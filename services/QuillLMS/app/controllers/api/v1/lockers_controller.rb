# frozen_string_literal: true

class Api::V1::LockersController < Api::ApiController
  def show
    user_id = params[:id]
    locker = Locker.find_by(user_id: user_id)
    if locker
      render json: { locker: locker }
    else
      render json: { no_locker: "Personal locker has not been created yet." }, status: 200
    end
  end

  def create
    locker = Locker.new(locker_params)
    if locker.save!
      render json: { locker: locker }, status: 200
    else
      render json: locker.errors, status: :unprocessable_entity
    end
  end

  def update
    user_id = params[:id]
    locker = Locker.find_by(user_id: user_id)
    if locker.update(locker_params)
      render json: { locker: locker }, status: 200
    else
      render json: locker.errors, status: :unprocessable_entity
    end
  end

  private def locker_params
    params.require(:locker).permit(:user_id, :label, preferences: {})
  end
end
