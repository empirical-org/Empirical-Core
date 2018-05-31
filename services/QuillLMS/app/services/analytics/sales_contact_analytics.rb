class SalesContactAnalytics
  def initialize(user_id, event, client = nil, stage_seeds = nil)
    @user_id     = user_id
    @event       = event
    @client      = client || SalesmachineClient
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
    handle_response { @client.event(event_data) }
  end

  def event_data
    {
      contact_uid: user.id.to_s,
      event_uid: @event,
      params: {
        account_uid: account_uid.to_s,
        display_name: @event.titleize
      }
    }
  end

  def handle_response(&block)
    response = block.call

    if response.success?
      true
    else
      raise response.status.to_s
    end
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
