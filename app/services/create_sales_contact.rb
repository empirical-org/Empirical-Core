class CreateSalesContact
  def initialize(user_id, stage_types_factory = nil)
    @user                = User.find(user_id)
    @stage_types_factory = stage_types_factory || SalesStageTypesFactory
  end

  def create
    if @user.teacher?
      create_stages
      true
    else
      false
    end
  end

  private

  def sales_contact
    @sales_contact ||= SalesContact.find_or_create_by(user: @user)
  end

  def stage_types
    @stage_types ||= @stage_types_factory.new.build
  end

  def create_stages
    stage_types.each do |stage_type|
      SalesStage.find_or_create_by(
        sales_stage_type: stage_type,
        sales_contact: sales_contact
      )
    end
  end
end
