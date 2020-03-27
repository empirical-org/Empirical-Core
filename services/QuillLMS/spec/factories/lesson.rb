FactoryBot.define do
  data = {
    flag: "archived",
    introURL: "",
    name: "Mr. Scibienski 1",
    questions: [{
      key: "-KDvcYlMzXMGe2pZFkoe",
      questionType: "questions"
    }, {
      key: "-KDxvlu4HqU0XbKdA-TO",
      questionType: "questions"
    }, {
      key: "-KDyfJTLaU8PzZwoVuNl",
      questionType: "questions"
    }, {
      key: "-KE7jdsVS1l5_6I7XyEc",
      questionType: "questions"
    }, {
      key: "-KFBdHkF01cjnGn0MC4X",
      questionType: "questions"
    }, {
      key: "-KDxw6oGJ9eYDVt-onRb",
      questionType: "questions"
    }]
  }

  factory :lesson do
    uid                   SecureRandom.uuid
    data                  data
  end
end
