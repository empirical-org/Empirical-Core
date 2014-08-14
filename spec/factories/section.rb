FactoryGirl.define do

  factory :section do
    sequence(:name) { |i| "section #{i}" }
    sequence(:position) { |i| i }

    workbook { Workbook.first || FactoryGirl.create(:workbook) }
  end

end
