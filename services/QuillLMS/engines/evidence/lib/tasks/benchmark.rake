# frozen_string_literal: true

require 'benchmark'

namespace :benchmark do

  desc "Runs a benchmark on the Plagiarism algorithm"

  task :plagiarism => :environment do |t, args|
    entries = [
      [
        "The 2014 pulse flow was considered successful, so they added 11.4 million gallons into the river.",
        "The 2014 pulse flow was considered successful, so scientists believe that it will be able to support other conservation efforts.",
        "The 2014 pulse flow was considered successful, so scientists think that it will support the other conservation efforts Pronatura Noroeste and other local groups are already leading.",
        "The 2014 pulse flow was considered successful, so countries have been willing to continue releasing water into the river.",
        "The 2014 pulse flow was considered successful, so scientists released water into the river to keep it from drying out again.",
        "The 2014 pulse flow was considered successful, so 11.4 billion gallons of water was emptied into the river to keep it from drying out.",
        "The 2014 pulse flow was considered successful, so 11.4 billion gallons of water was released to the river to keep it from drying out.",
        "The 2014 pulse flow was considered successful, so another 11.4 billion gallons of water was released into the river.",
        "The 2014 pulse flow was considered successful, so they decided to add more water.",
        "The 2014 pulse flow was considered successful, so one more 11.4 billion gallons of water were delivered into the river."
      ],
      [
        "A surge barrier in New York City could harm the local ecosystem, so advocates argued that those solutions would not have the same negative impact on the local ecosystem as surge barriers."
      ],
      [
        "The Amazon rainforest is essential to the Ikpeng and other Indigenous communities because the communities rely on the rainforrest for their livelihood and survival."
      ]
    ]

    passages = [
      "Due to the success of the 2014 pulse flow, another 11.4 billion gallons of water was released into the river in May 2021. Scientists think that this pulse flow will support the other conservation efforts Pronatura Noroeste and other local groups are already leading.",
      "Some environmental activists advocated for alternative solutions. Some proposed that New York City invest in building floodwalls and levees on the shore rather than surge barriers in the water. Advocates argued that those solutions would not have the same negative impact on the local ecosystem as surge barriers. Others offered entirely different solutions, such as raising up buildings and elevating New York City’s subway system.",
      "The Amazon rainforest is the world’s largest tropical rainforest. It spans Brazil and seven other South American countries. For thousands of years, the Amazon has been home to about 400 Indigenous tribes, including the Ikpeng. These communities rely on the rainforest for their livelihood. As Magaró Ikpeng, one of the leaders of the Yarang Women’s Movement, told Instituto Socioambiental, “The forest offers shelter, a garden, hunting.” The forest does more than provide food, shelter, and a way of life for Indigenous communities—it also benefits the rest of the world. The Amazon plays a key role in balancing the world’s climate by absorbing large amounts of carbon dioxide from the atmosphere. It also creates around six percent of the world’s oxygen."
    ]
    runtime = Benchmark.realtime do
      passages.each_with_index do |passage, index|
        entries[index].each do |entry|
          Evidence::PlagiarismCheck.new(entry, passage, '', nil).feedback_object
        end
      end
    end
    puts format('Average run time for the Plagiarism algorithm was %<runtime>.9f seconds', {runtime: (runtime / entries.length)})
  end
end
