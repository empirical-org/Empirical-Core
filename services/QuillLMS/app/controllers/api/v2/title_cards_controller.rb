class Api::V2::TitleCardsController < ApplicationController
#  before_filter :staff!, except: [:index, :show]
  before_filter :get_title_card_by_uid, only: [:show, :update, :destroy]
  skip_before_action :verify_authenticity_token

  def index
    if params[:uid]
      get_title_card_by_uid
      return show
    end
    render json: TitleCard.all.as_json
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
    rescue ActiveRecord::RecordNotUnique => e
      render json: {error: "Title card with UID '#{params[:uid]}' already exists."},
             status: :conflict
    end
  end

  def update
    return not_found unless @title_card
    return invalid_params unless @title_card.update(validate_params)
    render json: @title_card.as_json
  end

  def destroy
    @title_card.destroy
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
      render json: {}, status: :not_found
    end

    def invalid_params
      render json: @title_card.errors, status: :unprocessable_entity
    end
end
