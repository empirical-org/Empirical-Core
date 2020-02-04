require 'open3'
require 'csv'

module LicenseFinder

  OUTPUT_FOLDER = '/Users/danieldrabik/code/license_finder/'
  ROOT_DIR = '~/code/Empirical-Core/'
  JS_APPS = [
    'services/QuillLMS/client',
    # 'services/QuillConnect',
    # 'services/QuillDiagnostic',
    # 'services/QuillGrammar',
    # 'services/QuillLessons',
    # 'services/QuillLessonsServer',
    # 'services/QuillProofreader',
    # 'lambdas/rematching',
    # 'packages/apply-feature',
    # 'packages/quill-cdn',
    # 'packages/quill-component-library',
    # 'packages/quill-marking-logic',
    # 'packages/quill-spellchecker'
  ]

  RUBY_JS_APPS = [
    'services/QuillLMS',
    'services/QuillCMS',
    'services/QuillComprehension',
  ]

end

namespace :license_finder do
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
