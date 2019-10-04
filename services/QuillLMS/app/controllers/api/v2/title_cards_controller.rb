class Api::V2::TitleCardsController < Api::V2::ApiV2Controller
  wrap_parameters format: [:json]
  before_filter :get_title_card_by_uid, only: [:show, :update, :destroy]
  # We're turning this off for now because we don't have a clean way to
  # secure this endpoint
  #before_filter :auth_staff, except: [:index, :show]

  def index
    render(json: TitleCard.all.as_json || {title_cards:[]})
  end

  def show
    render(json: @title_card.as_json)
  end

  def create
    valid_params = validate_params
    valid_params[:uid] ||= SecureRandom.uuid
    @title_card = TitleCard.new(valid_params)
    return invalid_params(@title_card) unless @title_card.save
    render(json: @title_card.as_json)
  end

  def update
    return invalid_params(@title_card) unless @title_card.update(validate_params)
    render(json: @title_card.as_json)
  end

  def destroy
    @title_card.destroy
    render(plain: 'OK')
  end

  private def get_title_card_by_uid
    @title_card = TitleCard.find_by!(uid: params[:id])
  end

  private def validate_params
    params.require(:title_card)
          .permit(:uid, :content, :title)
  end
end
