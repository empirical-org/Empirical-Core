FactoryBot.define do
  data = {
    foo: 'bar'
  }
  factory :active_activity_session do
    uid                   SecureRandom.uuid
    data                  data
  end
end
