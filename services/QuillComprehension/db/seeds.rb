# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


activity = Activity.create({
  title: "Are Green Technologies Worth The Investment",
  article: """
    As Amanda walked through the park, she noticed a big new trash can called a BigBelly. When she looked it up on the web, it turned out to cost $6,000! The BigBelly has a solar-powered compactor inside, so it **maximizes** the amount of trash contained while minimizing the number of times it needs to be emptied. The BigBelly is one of many “green technologies” now available. But does it make sense to **invest** so much money in them? City managers and mayors say that each BigBelly will pay for itself in three years, because they only need to be emptied once a week. Traditional trash cans get emptied once or twice a day, at a cost of about $2,000 a year each, and the trucks that travel around to empty them use gasoline and pollute the air. Nonetheless, buying a lot of BigBelly cans could punch a big hole in any city’s budget!\n\nThe BigBelly uses a **renewable** energy source, the sun. Many other renewable technologies are under development. Some people are putting solar panels on their roofs, and switching from electricity produced with coal or gas to solar-powered electricity. Solar-powered cars and planes are under development. Solar-powered light strips have been installed on some rural highways; once in place, the strips run for free and rarely require maintenance. Investors are developing solar panels that can replace the asphalt on highways; these panels use solar power to generate heat (so that ice and snow melt immediately), light (so that streetlamps are unnecessary), and extra electricity for nearby towns and cities.\n\nInvestment in these solar technologies is expensive. The Department of Transportation gave $100,000 to the solar pavement project, but several million more will be needed just to finish the development. Is it worth investing in such expensive technologies? Should we **proceed** to invest in technologies that may never be practical on a large scale? Shouldn’t we **conserve** public funds for more immediate needs, like improving schools and fixing potholes? What if we develop green technologies but lack the funds to proceed with using them? How high a price should we pay for green technology?
  """
})

vocab_words = VocabularyWord.create([
  {"activity_id"=>activity.id, "text"=>"maximize", "description"=>"(verb) to increase to the greatest possible amount", "example"=>"Green technology can help conserve the natural environment and <strong>maximize</strong> resources."},
  {"activity_id"=>activity.id, "text"=>"conserve", "description"=>"(verb) to protect from loss", "example"=>"Jose and Rachel carefully <strong>conserved</strong> their water as they hiked through the desert."},
  {"activity_id"=>activity.id, "text"=>"renewable", "description"=>"(adjective) able to be replaced", "example"=>"Nations around the world are investing in <strong>renewable</strong> energy."},
  {"activity_id"=>activity.id, "text"=>"invest", "description"=>"(verb) to put money or resources toward something, expecting a future benefit", "example"=>"Research institutions <strong>invest</strong> a lot of money into programs for recycling, water purification, and\r\nrenewable energy."},
  {"activity_id"=>activity.id, "text"=>"proceed", "description"=>"(verb) to move forward", "example"=>"Since the road was under construction, many signs alerted drivers to “<strong>proceed</strong> with caution.”"}
])

question_sets = QuestionSet.create([
  {"activity_id"=>activity.id, "prompt"=>"We should invest heavily in green technologies.", "order"=>0},
  {"activity_id"=>activity.id, "prompt"=>"We should proceed cautiously with green technologies.", "order"=>1}
])

questions = Question.create([
  {"prompt"=>"We should invest heavily in green technologies, so", "order"=>2, "question_set_id"=>question_sets[0].id},
  {"prompt"=>"We should invest heavily in green technologies, but", "order"=>1, "question_set_id"=>question_sets[0].id},
  {"prompt"=>"We should invest heavily in green technologies because", "order"=>0, "question_set_id"=>question_sets[0].id},
  {"prompt"=>"We should proceed cautiously with green technologies, so", "order"=>2, "question_set_id"=>question_sets[1].id},
  {"prompt"=>"We should proceed cautiously with green technologies, but", "order"=>1, "question_set_id"=>question_sets[1].id},
  {"prompt"=>"We should proceed cautiously with green technologies because", "order"=>0, "question_set_id"=>question_sets[1].id},
])

response_labels = ResponseLabel.create([
  {"name"=>"correct"},
  {"name"=>"logical"},
  {"name"=>"detailed"},
  {"name"=>"grammatical"},
  {"name"=>"full sentence"},
  {"name"=>"relevant"},
  {"name"=>"well structured"}
])