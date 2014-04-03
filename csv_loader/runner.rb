require './loader'
require './parser'

loader = GoogleDriveLoader.new

loader.files.each do |file|
  AprilFirst2014QuestionParser.new(file.data)
end

require './loader'
loader = GoogleDriveLoader.new
loader.files.first.data
