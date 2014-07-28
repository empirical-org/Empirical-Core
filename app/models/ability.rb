class Ability
  include CanCan::Ability

  def initialize(user)
    @user = user || User.new # If there is no user here, then they are not logged in
    self.send(@user.role.to_sym || :temporary) # If a role is unset, then the role should be temporary
  end

  def admin
    can :manage, :all
    teacher
  end

  def teacher
    can :create, Classroom
    user
  end

  def user
    can :read, ActivitySession, user_id: @user.id
    can :read, Activity
    can :create, ActivitySession
    can :destroy, :all, user_id: @user.id
    can :update, :all, user_id: @user.id
    temporary
  end

  def temporary

  end

end
