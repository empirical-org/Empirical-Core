# frozen_string_literal: true

FactoryBot.define do
  factory :standard_level do
    uid                 { SecureRandom.urlsafe_base64 } # mock a uid
    sequence(:name)     { |i| "Standard Level #{i}" }
    sequence(:position) { |i| i + 500 } # add 500 to avoid collisions

    factory :grade_1_standard_level do
      name      { '1st Grade CCSS' }
      position  { 2 }
      uid       { 'jneT9cJncNph27UU-PC_5w' }
    end

    factory :grade_2_standard_level do
      name      { '2nd Grade CCSS' }
      position  { 3 }
      uid       { 'SjFEDFLjohH_JnV_airxiQ' }
    end

    factory :grade_3_standard_level do
      name      { '3rd Grade CCSS' }
      position  { 4 }
      uid        { '9XKMizwyMg9mWt1JO-YRdw' }
    end

    factory :grade_4_standard_level do
      name      { '4th Grade CCSS' }
      position  { 5 }
      uid       { 'IVVpQRuwcdVGC6Hga6rSlw' }
    end

    factory :grade_5_standard_level do
      name      { '5th Grade CCSS' }
      position  { 6 }
      uid       { 'SDwSWNBUa8uGIF6D5nduxQ' }
    end

    factory :grade_6_standard_level do
      name      { '6th Grade CCSS' }
      position  { 7 }
      uid       { 'pefm8jABcs108wEfebal4Q' }
    end

    factory :grade_7_standard_level do
      name      { '7th Grade CCSS' }
      position  { 8 }
      uid       { '8g1_400wzXuijt4NB9uqtw' }
    end

    factory :grade_8_standard_level do
      name      { '8th Grade CCSS' }
      position  { 9 }
      uid       { '88T95ukdK0qcg16zySuCoQ' }
    end

    factory :grade_9_standard_level do
      name      { '9th Grade CCSS' }
      position  { 10 }
      uid       { 'ISQpIoW3aTHGXdecY1YgDQ' }
    end

    factory :grade_10_standard_level do
      name      { '10th Grade CCSS' }
      position  { 11 }
      uid       { '72J_khB7BfgHl7gc_KUgjg' }
    end

    factory :grade_11_standard_level do
      name      { '11th Grade CCSS' }
      position  { 12 }
      uid       { 'Dxi2Tfy_J61D9z_DQGd1tA' }
    end

    factory :grade_12_standard_level do
      name      { '12th Grade CCSS' }
      position  { 13 }
      uid       { '8cYZDGqO-IGixwhlAzlFnA' }
    end

    factory :university_standard_level do
      name      { 'University Lessons' }
      position  { 17 }
      uid       { 'g7H8amopenROkESNZ-nuZw' }
    end

    factory :diagnostic_standard_level do
      name      { 'Diagnostic' }
      position  { 19 }
      uid       { 'w-FS_PyaoAnRt9ZiVQQZgA' }
    end

    trait :with_change_log do
      after(:create) do |t|
        create(:change_log, changed_record: t)
      end
    end

  end
end
