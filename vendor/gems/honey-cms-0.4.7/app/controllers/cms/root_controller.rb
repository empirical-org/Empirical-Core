class CMS::RootController < ApplicationController
  before_filter :admin!
  before_filter :set_active
  layout 'cms'

  def description
  end

  def index
  end

  protected

  def admin!
    unless signed_in? && current_user.role.admin?
      auth_failed
    end
  end

  def set_active
    @active_page = /cms/
  end
end
