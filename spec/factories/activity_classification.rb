FactoryGirl.define do

  factory :activity_classification, aliases: [:classification] do

    sequence(:name) { |i| "activity cls #{i}" }
    sequence(:key)  { |i| "activity_cls_#{i}" }

    module_url { "http://#{Forgery(:internet).domain_name}/activity_cls/module" }
    form_url { "http://#{Forgery(:internet).domain_name}/activity_cls/form" }

  end

end
