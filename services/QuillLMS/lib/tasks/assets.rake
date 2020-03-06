# frozen_string_literal: true

if defined?(Sprockets)
  Rake::Task["assets:precompile"]
    .enhance do
      `npm run build:production:client`
    end
end
