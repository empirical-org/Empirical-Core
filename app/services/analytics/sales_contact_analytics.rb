class SalesContactAnalytics
  def initialize(user_id, event, client = nil, stage_seeds = nil)
    @user_id     = user_id
    @event       = event
    @client      = client || $smclient
    @stage_seeds = stage_seeds || SalesStageTypesFactory::STAGE_TYPE_SEEDS
  end

  def track
    if events.include? @event
      track_event
    else
      false
    end
  end

  private

  def track_event
    @client.track(
      contact_uid: user.id,
      event: @event,
      params: {
        account_uid: user.school.id,
        display_name: @event.titleize
      }
    )
  end

  def user
    @user ||= User.find(@user_id)
  end

  def events
    @events ||= @stage_seeds.map { |seed| seed[:name].parameterize.underscore }
  end
end
