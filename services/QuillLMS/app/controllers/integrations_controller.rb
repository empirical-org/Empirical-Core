class IntegrationsController < ApplicationController
  include HTTParty
  layout "integrations"

  def amplify
    store_partner_session()
    @body_class = 'full-width-page white-page'
    @js_file = 'public'
    @active_tab = 'Featured Activities'
    # get list of activities to pass to view
    # @section = if params[:section_id].present? then Section.find(params[:section_id]) else Section.first end
    @section = Section.first
    # @topics = Section.topics.map{ |topic| [topic, topic.activities.production] }.select{ |group| group.second.any? }
    @topics = Topic.all.map{ |topic| [topic, topic.activities.production] }.select{ |group| group.second.any? }
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
