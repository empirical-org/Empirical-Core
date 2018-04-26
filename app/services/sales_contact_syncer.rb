class SalesContactSyncer
  def initialize(teacher_id, serializer = nil, client = nil)
    @teacher_id = teacher_id
    @serializer = serializer || SerializeSalesContact
    @client     = client || SalesmachineClient
  end

  def sync
    if user && user.teacher?
      @client.batch([account_data])
      true
    else
      false
    end
  end

  private

  def account_data
    @serializer.new(@teacher_id).data
  end

  def user
    @user ||= User.find(@teacher_id)
  end
end
