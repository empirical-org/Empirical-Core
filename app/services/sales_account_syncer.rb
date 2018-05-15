class SalesAccountSyncer
  def initialize(school_id, serializer = nil, client = nil)
    @school_id  = school_id
    @serializer = serializer || SerializeSalesAccount
    @client     = client || SalesmachineClient
  end

  def sync
    @client.batch([account_data])
  end

  private

  def account_data
    @serializer.new(@school_id).data
  end
end
