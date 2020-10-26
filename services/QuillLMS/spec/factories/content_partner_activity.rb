FactoryBot.define do
  factory :content_partner_activity do
    content_partner { ContentPartner.last || create(:content_partner) }
    activity { Activity.last || create(:activity) }
  end
end
