class Api::V1::TitleCardsController < Api::ApiController
  wrap_parameters format: [:json]
  before_action :retrieve_title_card_type, only: [:index, :create]
  before_action :title_card_by_uid, only: [:show, :update, :destroy]

  def index
    render(json: TitleCard.where(title_card_type: @title_card_type.to_s).as_json)
  end

  def show
    render(json: @title_card.as_json)
  end

  def create
    valid_params = validate_params
    valid_params[:uid] ||= SecureRandom.uuid
    valid_params[:title_card_type] ||= @title_card_type
    @title_card = TitleCard.create!(valid_params)
    render(json: @title_card.as_json)
  end

  def update
    @title_card.update!(validate_params)
    render(json: @title_card.as_json)
  end

  def destroy
    @title_card.destroy
    render(plain: 'OK')
  end

  private def title_card_by_uid
    @title_card = TitleCard.find_by!(uid: params[:id], title_card_type: params[:title_card_type])
  end

  private def retrieve_title_card_type
    @title_card_type = params[:title_card_type]
  end

  private def validate_params
    params.require(:title_card)
          .permit(:uid, :content, :title)
  end
end
