FactoryGirl.define do

  factory :activity do

    sequence(:name) { |i| "activity #{i}" }
    description { Forgery(:lorem_ipsum).sentence }
    data { {
      body: "In 1914, Ernest Shackleton set {+off-of|1} on an exploration across the Antarctic. In 1915 his ship, Endurance, became trapped in the ice, and {+its-it's|2} crew was stuck.",
      instructions: "There are **two errors** in this passage. *To edit a word, click on it and re-type it.*"
    } }

    topic { Topic.first || FactoryGirl.create(:topic) }
    classification { ActivityClassification.first || FactoryGirl.create(:classification) }

  end

end
