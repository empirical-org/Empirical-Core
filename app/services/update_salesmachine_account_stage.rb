class UpdateSalesmachineAccountStage
  def initialize(school_id, stage, client = $smclient)
    @school_id = school_id
    @stage     = stage.to_sym
    @client    = client
  end

  def update
    return false unless valid_stage?
    result = update_sales_account!

    if result
      @client.account({ account_uid: school.id, params: sales_account.data })
    end

    result
  end

  private

  def update_sales_account!
    sales_account.data = updated_data
    sales_account.save!
  end

  def updated_data
    new_data.merge(sales_account.data.compact)
  end

  def default_data
    @default_data ||= Hash.new.tap do |hash|
      valid_stages.each do |stage|
        hash[stage] = nil
      end
    end
  end

  def new_data
    default_data.merge(@stage => DateTime.now.to_i)
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
