# frozen_string_literal: true

if defined?(Sprockets)
  Rake::Task["assets:precompile"]
    .enhance do
      puts '***** Start npm run build:production:client'
      `npm run build:production:client`
      puts '***** End npm run build:production:client'
    end
end
