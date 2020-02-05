# Tasks to generate a list of licenses for external packages and gems
# These tasks rely on the license_finder gem: https://github.com/pivotal/LicenseFinder
# Pre-requisite, run: gem install license_finder
require 'open3'
require 'csv'

namespace :license_finder do
  # NB: this takes ~30 minutes to run, it will log errors in this folder path
  # To run acurately, it needs the dependencies installed locally,
  # so if there are issues within any of the npm/bundler/pip installs,
  # you'll need to debug those.
  desc 'Create one license summary file for all of the apps listed in paths'
  task :all_apps do |t|
    # NB: folder paths aren't relative
    folder_paths = (LicenseFinder::JS_APPS + LicenseFinder::RUBY_JS_APPS + LicenseFinder::PYTHON_APPS)
      .uniq
      .map {|path| LicenseFinder::ROOT_DIR + path}
      .join(' ')
    columns = LicenseFinder::OUTPUT_COLUMNS.join(' ')
    filename = ['summary-', Time.now.to_s.gsub(/:|\s/,"-"), '.csv'].join('')

    # This is the license_finder command
    # --prepare-no-fail runs 'npm install', 'bundle install', 'pip install' where appropriate, but continues even on failure.
    # --quiet removes some debug info (that isn't in csv format)
    # --aggregate-paths allows you to list multiple locations to run
    # --columns allows you to specify what the report outputs
    # --save outputs files to destination

    command = "license_finder report --prepare-no-fail --quiet --format csv --columns #{columns} --aggregate-paths #{folder_paths} --save #{filename}"

    stdout, _, _ = Open3.capture3(command)

    # filename = ['summary-', Time.now.to_s.gsub(/:|\s/,"-"), '.csv'].join('')
    # output_destination = [LicenseFinder::OUTPUT_FOLDER, filename].join('')

    # File.open(output_destination, "w+") do |f|
    #   f.puts stdout
    # end
  end

  task :only_js_apps do |t|
    LicenseFinder::JS_APPS.each do |folder|
      command = "cd #{LicenseFinder::ROOT_DIR}#{folder}; npm install; license_finder report --format csv"
      stdout, _, _ = Open3.capture3(command)
      name = folder.split("/").last
      destination = [LicenseFinder::OUTPUT_FOLDER, name,'.csv'].join('')

      File.open(destination, "w+") do |f|
        f.puts stdout
      end
    end
  end
end

module LicenseFinder
  # OUTPUT_FOLDER = '/Users/danieldrabik/code/license_finder/'
  ROOT_DIR = '~/code/Empirical-Core/'
  JS_APPS = [
    'services/QuillLMS/client',
    'services/QuillConnect',
    'services/QuillDiagnostic',
    'services/QuillGrammar',
    'services/QuillLessons',
    'services/QuillLessonsServer',
    'services/QuillProofreader',
    'lambdas/rematching',
    'packages/apply-feature',
    'packages/quill-cdn',
    'packages/quill-component-library',
    'packages/quill-marking-logic',
    'packages/quill-spellchecker'
  ]

  RUBY_JS_APPS = [
    'services/QuillLMS',
    'services/QuillCMS',
    'services/QuillComprehension'
  ]

  PYTHON_APPS = [
    'services/comprehensions/automl-api-prototype',
    'services/comprehensions/bing-spelling-api',
    'services/comprehensions/feedback-api-main',
    'services/comprehensions/frontend',
    'services/comprehensions/grammar-local-api',
    'services/comprehensions/main-api',
    'services/comprehensions/spelling-local-api'
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
