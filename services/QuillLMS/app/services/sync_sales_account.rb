class SyncSalesAccount

  def initialize(school_id, serializer = nil, client = nil)
    @school_id  = school_id
    @serializer = serializer || SerializeSalesAccount
    @client     = client || SalesmachineClient
  end

  def call
    client.batch([account_data])
  end

  private

  attr_reader :school_id, :serializer, :client

  def account_data
    serializer.new(school_id).data
  end
end
