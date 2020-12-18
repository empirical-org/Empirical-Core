# Tasks to generate a list of licenses for external packages and gems
# These tasks rely on the license_finder gem: https://github.com/pivotal/LicenseFinder
# Pre-requisite, run: gem install license_finder
require 'open3'
require 'csv'

namespace :license_finder do
  # NB: this takes ~30 minutes to run the first time, it will log errors in this folder path
  # To run acurately, it needs the dependencies installed locally,
  # so if there are issues within any of the npm/bundler/pip installs,
  # you'll need to debug those.
  # Runs much faster subsequent times since the installs are the time consuming parts
  desc 'Create one license summary file for all of the apps listed in paths'
  task :all_apps do |t|
    folder_paths = LicenseFinder.absolute_paths_for(LicenseFinder::JS_APPS + LicenseFinder::RUBY_JS_APPS + LicenseFinder::PYTHON_APPS)
    columns = LicenseFinder::OUTPUT_COLUMNS.join(' ')
    filename = 'summary'

    LicenseFinder.run(folder_paths, columns, filename)
  end

  # Added seperate takes for each type of app, since these were easier to debug
  task :js_apps do |t|
    folder_paths = LicenseFinder.absolute_paths_for(LicenseFinder::JS_APPS)
    columns = LicenseFinder::OUTPUT_COLUMNS.join(' ')
    filename = 'js-summary'

    LicenseFinder.run(folder_paths, columns, filename)
  end
  task :ruby_js_apps do |t|
    folder_paths = LicenseFinder.absolute_paths_for(LicenseFinder::RUBY_JS_APPS)
    columns = LicenseFinder::OUTPUT_COLUMNS.join(' ')
    filename = 'ruby-js-summary'

    LicenseFinder.run(folder_paths, columns, filename)
  end

  task :python_apps do |t|
    folder_paths = LicenseFinder.absolute_paths_for(LicenseFinder::PYTHON_APPS)
    columns = LicenseFinder::OUTPUT_COLUMNS.join(' ')
    filename = 'python-summary'

    LicenseFinder.run(folder_paths, columns, filename)
  end
end

module LicenseFinder

  def self.run(filepaths, columns, output_file_prefix)
    raise  NO_RESULTS_DIR unless Dir.exist?(RESULTS_DIR)
    output_file = [output_file_prefix,'-', Time.now.to_s.gsub(/:|\s/,"-"), '.csv'].join('')

    # This is the license_finder command
    # https://github.com/pivotal/LicenseFinder
    # --prepare-no-fail runs 'npm install', 'bundle install', 'pip install' where appropriate, but continues even on failure.
    # --quiet removes some debug info (that isn't in csv format)
    # --aggregate-paths allows you to list multiple locations to run
    # --columns allows you to specify what the report outputs
    # --save outputs files to a destination
    # --python-version specifies whether to use python 2 or 3
    command = "license_finder report --prepare-no-fail --quiet --format csv --columns #{columns} --aggregate-paths #{filepaths} --save #{RESULTS_DIR}/#{output_file} --python-version 3"

    Open3.capture3(command)
  end

  # NB: folder paths aren't relative, need to be absolute
  def self.absolute_paths_for(path_array)
    path_array.uniq.map {|path| LicenseFinder::ROOT_DIR + path}.join(' ')
  end

  RESULTS_DIR = 'license_finder_results'
  NO_RESULTS_DIR = "***No results directory! Create an '#{RESULTS_DIR}' folder in this directory and try again***"
  ROOT_DIR = '~/code/Empirical-Core/'
  JS_APPS = [
    'services/QuillLMS/client',
    'services/QuillConnect',
    'services/QuillDiagnostic',
    'services/QuillGrammar',
    'services/QuillLessons',
    'services/QuillLessonsServer',
    'services/QuillProofreader',
    'services/comprehension/frontend',
    'lambdas/rematching',
    'packages/apply-feature',
    'packages/quill-cdn',
    'packages/quill-marking-logic',
    'packages/quill-spellchecker'
  ]

  RUBY_JS_APPS = [
    'services/QuillLMS',
    'services/QuillCMS',
    'services/QuillComprehension'
  ]

  PYTHON_APPS = [
    'services/comprehension/automl-api-prototype',
    'services/comprehension/bing-spelling-api',
    'services/comprehension/feedback-api-main',
    'services/comprehension/grammar-local-api',
    'services/comprehension/main-api',
    'services/comprehension/spelling-local-api'
  ]

  # Sets the order and the columns for the generated csv file
  OUTPUT_COLUMNS = [
    'install_path',
    'name',
    'version',
    'licenses',
    'license_links',
    'homepage',
    'package_manager',
    'groups'
  ]
end
