class IpLocationController < ApplicationController
  def index
    @ip_location = IpLocation.all
  end

  def new
    @ip_location = IpLocation.new
  end

  def create
    @ip_location = IpLocation.create(ip_location.params)
  end

  def update
  end

  def destroy
  end
end
