class Cms::SubscriptionsController < ApplicationController
  # does rails automatically pull user given that this is a nested resource?
  before_action :get_user

  def show
  end

  def update
  end

  def destroy
  end

  def get_user
    @user = User.find params[:user_id]
  end
end