# frozen_string_literal: true

require "benchmark"
require "open3"

if defined?(Sprockets)
  Rake::Task["assets:precompile"]
    .enhance do
      npm_build = "npm run build:production:client"

      puts "***** Start #{npm_build}"
      time = Benchmark.realtime do
        # Use open3 so an error aborts the build (backticks `` swallow the error)
        Open3.popen3(npm_build)
      end
      puts "***** End #{npm_build}"
      puts "Time elapsed: #{time} seconds"
    end
end
