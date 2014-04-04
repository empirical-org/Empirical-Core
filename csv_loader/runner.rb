require './csv_loader/parser'
require './csv_loader/loader'

loader = GoogleDriveLoader.new

Activity.flag_all(:archived)
Rule.flag_all(:archived)

loader.files.each do |file|
  AprilFirst2014QuestionParser.new(file.data)
end

require './loader'
loader = GoogleDriveLoader.new
loader.files.first.data
