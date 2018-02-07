class Cms::AnnouncementsController < ApplicationController
  before_filter :signed_in!
  before_filter :staff!

  def index
    @announcements = Announcement.all
  end

  def create
    Announcement.create(announcement_params)
    redirect_to cms_announcements_path
  end

  def new
    @announcement = Announcement.new
  end

  def edit
    @announcement = Announcement.find(params[:id])
  end

  def update
    Announcement.find(params[:id]).update(announcement_params)
    redirect_to cms_announcements_path
  end

  private
  def announcement_params
    params.require(:announcement).permit(:announcement_type, :link, :text, :start, :end)
  end
end
