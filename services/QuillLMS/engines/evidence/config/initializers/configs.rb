# frozen_string_literal: true

require "yaml"

module Evidence
  class Configs
    DEFAULT_PATH = Evidence::Engine.root.join('config')

    def self.from_yml(file, path: DEFAULT_PATH)
      YAML
        .load_file(path + "#{file}.yml")
        .with_indifferent_access[:default]
    end
  end
end
