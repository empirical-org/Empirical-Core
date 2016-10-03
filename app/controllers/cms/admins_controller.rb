class Cms::AdminsController < ApplicationController
  before_filter :staff!
  before_action :set_admin, only: [:update, :destroy]

  def index
    respond_to do |format|
      format.html
      format.json do
        render json: User.where(role: 'admin')
      end
    end
  end

  def create
    @admin = User.new(admin_params)
    @admin.role = 'admin'
    if @admin.save!
      render json: @admin
    else
      render json: @admin.errors, status: 422
    end
  end

  def update
    @admin.assign_attributes(admin_params)
    if @admin.save
      render json: @admin
    else
      render json: @admin.errors, status: 422
    end
  end

  def destroy
    @admin.destroy
    render json: {}
  end

  private

  def set_admin
    @admin = User.find(params[:id])
  end

  def admin_params
    params.require(:admin).permit(:id, :name, :email, :password)
  end
end
