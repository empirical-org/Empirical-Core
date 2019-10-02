class Api::V2::TitleCardsController < ApplicationController
  wrap_parameters format: [:json]
  before_filter :auth_staff, except: [:index, :show]
  before_filter :get_title_card_by_uid, only: [:show, :update, :destroy]
  skip_before_action :verify_authenticity_token

  def index
    render json: TitleCard.all.as_json or {title_cards:[]}
  end

  def show
    return not_found unless @title_card
    render json: @title_card.as_json
  end

  def create
    @title_card = TitleCard.new(validate_params)
    begin
      return invalid_params unless @title_card.save
      render json: @title_card.as_json
    rescue ActiveRecord::RecordNotUnique
      return duplicate_uid
    end
  end

  def update
    begin
      return not_found unless @title_card
      return invalid_params unless @title_card.update(validate_params)
      render json: @title_card.as_json
    rescue ActiveRecord::RecordNotUnique
      duplicate_uid
    end
  end

  def destroy
    return not_found unless @title_card
    @title_card.destroy
    render plain: 'OK'
  end

  private

    def get_title_card_by_uid
      @title_card = TitleCard.find_by(uid: params[:uid])
    end

    def validate_params
      params.require(:title_card)
            .permit(:uid, :content, :title)
    end

    def not_found
      render plain: '', status: :not_found
    end

    def invalid_params
      render json: @title_card.errors, status: :unprocessable_entity
    end

    def duplicate_uid
      render json: {error: "Title card with UID '#{params[:title_card][:uid]}' already exists."},
             status: :conflict
    end

    def auth_staff
      return render plain: 'Only available to authorized "staff" users', status: :forbidden unless current_user.try(:staff?)
    end
end
