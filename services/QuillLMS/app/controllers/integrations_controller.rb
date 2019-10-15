class IntegrationsController < ApplicationController
  include HTTParty
  layout "integrations"

  def amplify
    store_partner_session()
    @body_class = 'full-width-page white-page'
    @js_file = 'public'
    @active_tab = 'Featured Activities'
    @unit_templates = cached_amplify_unit_templates
  end

  def amplify_all
    @body_class = 'full-width-page white-page'
    @js_file = 'public'
    @active_tab = 'Explore All Activities'
    @section = if params[:section_id].present? then Section.find(params[:section_id]) else Section.first end
    @topics = @section.topics.map{ |topic| [topic, topic.activities.production] }.select{ |group| group.second.any? }
    render :template => 'integrations/amplify'
  end

  def cached_amplify_unit_templates
    Rails.cache.fetch(:selected_amplify_unit_templates, :expires_in => 1.day) do
      selected_amplify_topics
    end
  end

  def selected_amplify_topics
    selected_unit_templates = []
    selected_amplify_unit_template_ids().each do |id|
      begin
        selected_unit_templates << UnitTemplate.find(id)
      rescue ActiveRecord::RecordNotFound => e
        puts "NO UnitTemplate RECORD FOUND FOR ID #{id}"
        NewRelic::Agent.add_custom_attributes({
          unit_template_id: id
        })
        NewRelic::Agent.notice_error(e)
      end
    end
    selected_unit_templates
  end

  def selected_amplify_unit_template_ids
    # This is a canonical list of UnitTemplate ids for the Amplify integration
    # They are ordered here as they are intended to appear on the page
    [
      92,
      93,
      94,
      95,
      96,
      97,
      98
    ]
  end

  def store_partner_session
    # Assumes that each partner gets a unique action corresponding to their name
    @partner_name = action_name
    @session_id = params[:session_id]
    session[:partner_session] = {
      "partner_name" => @partner_name,
      "session_id" => @session_id
    }
  end

end
