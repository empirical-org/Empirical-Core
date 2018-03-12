class UpdateSalesmachineAccountStage
  def initialize(school_id, stage, client = $smclient)
    @school_id = school_id
    @stage     = stage.to_sym
    @client    = client
  end

  def update
    return false unless valid_stage?

    sales_account.data.merge!(@stage => DateTime.now.to_i)
    result = sales_account.save!

    if result
      @client.account({ account_uid: school.id, params: sales_account.data })
    end

    result
  end

  def valid_stages
    @valid_stages ||= SalesAccount::STAGES.map(&:to_sym)
  end

  def valid_stage?
    valid_stages.include? @stage
  end

  def sales_account
    @sales_account ||= SalesAccount.where(school: school).first_or_initialize
  end

  def school
    @school ||= School.find(@school_id)
  end
end
