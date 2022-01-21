# frozen_string_literal: true

require 'benchmark'

namespace :benchmark do

  desc "Runs a benchmark on the Plagiarism algorithm"

  task :plagiarism => :environment do |t, args|
    entries = [
      "The 2014 pulse flow was considered successful, so they added 11.4 million gallons into the river.",
      "The 2014 pulse flow was considered successful, so scientists believe that it will be able to support other conservation efforts.",
      "The 2014 pulse flow was considered successful, so scientists think that it will support the other conservation efforts Pronatura Noroeste and other local groups are already leading.",
      "The 2014 pulse flow was considered successful, so countries have been willing to continue releasing water into the river.",
      "The 2014 pulse flow was considered successful, so scientists released water into the river to keep it from drying out again.",
      "The 2014 pulse flow was considered successful, so 11.4 billion gallons of water was emptied into the river to keep it from drying out.",
      "The 2014 pulse flow was considered successful, so 11.4 billion gallons of water was released to the river to keep it from drying out.",
      "The 2014 pulse flow was considered successful, so another 11.4 billion gallons of water was released into the river.",
      "The 2014 pulse flow was considered successful, so they decided to add more water.",
      "The 2014 pulse flow was considered successful, so one more 11.4 billion gallons of water were delivered into the river.",
    ]
    
    passage = "Due to the success of the 2014 pulse flow, another 11.4 billion gallons of water was released into the river in May 2021. Scientists think that this pulse flow will support the other conservation efforts Pronatura Noroeste and other local groups are already leading."
    runtime = Benchmark.realtime do
      entries.each do |entry|
        Evidence::PlagiarismCheck.new(entry, passage, '', nil).feedback_object
      end
    end
    puts 'Average run time for the Plagiarism algorithm was %.9f seconds' % (runtime / entries.length)
  end
end
