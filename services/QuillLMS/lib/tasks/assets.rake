# frozen_string_literal: true

require "benchmark"

if defined?(Sprockets)
  Rake::Task["assets:precompile"]
    .enhance do

      puts '***** Start npm run build:production:client'
      time = Benchmark.realtime do
        `npm run build:production:client`
      end
      puts '***** End npm run build:production:client'
      puts "Time elapsed: #{time} seconds"
    end
end
