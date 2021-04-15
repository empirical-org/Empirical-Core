class CreateSalesContact
  def initialize(user_id, stage_types_factory = nil)
    @user                = User.find(user_id)
    @stage_types_factory = stage_types_factory || SalesStageTypesFactory
  end

  def call
    return false unless can_create_sales_contact?

    begin
      ActiveRecord::Base.transaction { create_stages }
      true
    rescue ActiveRecord::StatementInvalid
      false
    end
  end

  private def can_create_sales_contact?
    @user.teacher?
  end

  private def sales_contact
    @sales_contact ||= SalesContact.find_or_create_by!(user: @user)
  end

  private def stage_types
    @stage_types ||= @stage_types_factory.new.build
  end

  private def create_stages
    stage_types.each do |stage_type|
      SalesStage.find_or_create_by!(
        sales_stage_type: stage_type,
        sales_contact: sales_contact
      )
    end
  end
end
