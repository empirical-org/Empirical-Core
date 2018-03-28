class SalesContactAnalytics
  def initialize(user_id, event, client = nil, stage_seeds = nil)
    @user_id     = user_id
    @event       = event
    @client      = client || SegmentAnalytics.new
    @stage_seeds = stage_seeds || SalesStageTypesFactory::STAGE_TYPE_SEEDS
  end

  def track
    if valid_events.include? @event
      track_event
    else
      false
    end
  end

  private

  def track_event
    @client.track(
      user_id: user.id,
      event: @event,
      properties: {
        account_uid: account_uid,
        display_name: @event.titleize
      }
    )
  end

  def user
    @user ||= User.find(@user_id)
  end

  def account_uid
    if user.present? && user.school.present?
      user.school.id
    end
  end

  def valid_events
    @events ||= @stage_seeds.map { |seed| seed[:name].parameterize.underscore }
  end
end
