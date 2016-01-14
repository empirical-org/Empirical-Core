class Cms::AdminAccountsController < ApplicationController
  before_filter :staff!
  before_action :set_admin_account, only: [:update, :destroy]
  respond_to :json

  def index
    respond_to do |format|
      format.html
      format.json do
        render json: AdminAccount.all.map{|a| Cms::AdminAccountSerializer.new(a).as_json(root: false)}
      end
    end
  end

  def create
    @admin_account = AdminAccount.new
    create_and_update_helper(@admin_account, admin_account_params)
  end

  def update
    create_and_update_helper(@admin_account, admin_account_params)
  end

  def destroy
    @admin_account.destroy
    render json: {}
  end

  private

  def create_and_update_helper(admin_account, hash)
    admin_account.update(name: hash[:name])

    if hash[:admins].present?
      admin_emails = hash[:admins].map{ |aa| aa[:email] }
      admin_account.admins = User.where(email: admin_emails, role: 'admin')
    else
      admin_account.admins = []
    end

    if hash[:teachers].present?
      teacher_emails = hash[:teachers].map{ |ta| ta[:email] }
      admin_account.teachers = User.where(email: teacher_emails)
    else
      admin_account.teachers = []
    end

    if admin_account.save
      render json: admin_account
    else
      render json: admin_account.errors, status: 422
    end
  end

  def set_admin_account
    @admin_account = AdminAccount.find(params[:id])
  end

  def admin_account_params
    params.require(:admin_account).permit(:id, :name, admins: [:id, :email], teachers: [:id, :email])
  end
end