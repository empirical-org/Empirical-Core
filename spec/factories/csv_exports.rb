# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :csv_export do
    export_type 'activity_sessions'
  end
end
