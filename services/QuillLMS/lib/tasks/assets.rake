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
        stdout, stderr, status = Open3.capture3(npm_build)

        if !status.success?
          abort 'error: could not execute command'
        end
      end
      puts "***** End #{npm_build}"
      puts "Time elapsed: #{time} seconds"
    end
end

namespace :asset_test do

  task task: :environment do
    # output = `erroing command`
    # if $?.success?
    #   puts 'success'
    # else
    #   abort 'eror'
    # end

    stdout, stderr, status = Open3.capture3('ls -l')

    if status.success?
      puts stdout
    else
      abort 'error: could not execute command'
    end
  end
end
