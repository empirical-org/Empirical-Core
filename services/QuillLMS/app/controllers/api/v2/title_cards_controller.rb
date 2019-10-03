class Api::V2::TitleCardsController < Api::V2::ApiV2Controller
  wrap_parameters format: [:json]
  before_filter :auth_staff, except: [:index, :show]
  before_filter :get_title_card_by_uid, only: [:show, :update, :destroy]

  def index
    render(json: TitleCard.all.as_json || {title_cards:[]})
  end

  def show
    render(json: @title_card.as_json)
  end

  def create
    @title_card = TitleCard.new(validate_params)
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
