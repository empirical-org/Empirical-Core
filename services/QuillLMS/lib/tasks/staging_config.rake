# frozen_string_literal: true

require 'open3'

namespace :staging_config do

  # bundle exec rake staging_config:copy_from_staging_to_personals\[SOME_KEY\]
  desc "copy a config from main staging to all other staging envs"
  task :copy_from_staging_to_personals, [:config] => :environment do |t,args|
    include StagingConfigCommands

    config = args[:config]

    staging_value = get_config(config, STAGING_APP)
    config_setting = "#{config}=#{staging_value}"

    STAGING_PERSONAL_APPS.each do |app|
      set_config(config_setting, app)
    end
  end

  # bundle exec rake staging_config:set_all\[TEST_KEY='some_value'\]
  desc "set a config key/value on all staging envs"
  task :set_all, [:config_setting] => :environment do |t,args|
    include StagingConfigCommands
    config_setting = args[:config_setting]

    ALL_STAGING_APPS.each do |app|
      set_config(config_setting, app)
    end
  end

  # bundle exec rake staging_config:remove_all\[TEST_KEY\]
  desc "delete a config from all staging envs"
  task :remove_all, [:config] => :environment do |t,args|
    include StagingConfigCommands
    config = args[:config]

    ALL_STAGING_APPS.each do |app|
      remove_config(config, app)
    end
  end

  # Add basic wrapper around heroku commands:
  # Reference: https://devcenter.heroku.com/articles/config-vars
  module StagingConfigCommands
    def get_config(config, app)
      # returns a newline, so chomp it
      run_cmd("heroku config:get #{config} --app=#{app}").chomp
    end

    def set_config(config_setting, app)
      run_cmd("heroku config:set #{config_setting} --app=#{app}")
    end

    def remove_config(config, app)
      run_cmd("heroku config:unset #{config} --app=#{app}")
    end

    def run_cmd(command)
      stdout_str, stderr_str, = Open3.capture3(command)

      puts stdout_str
      puts stderr_str

      stdout_str
    end

    STAGING_APP = 'empirical-grammar-staging'
    STAGING_PERSONAL_APPS = %w(
      quill-lms-brendan
      quill-lms-cissy
      quill-lms-dan
      quill-lms-emilia
      quill-lms-eric
      quill-lms-pkong
      quill-lms-thomas
      empirica-grammar-security
    )
    ALL_STAGING_APPS = STAGING_PERSONAL_APPS + [STAGING_APP]
  end
end
