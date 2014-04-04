require './csv_loader/parser'
require './csv_loader/loader'

loader = GoogleDriveLoader.new

Activity.flag_all(:archived)
Rule.flag_all(:archived)

loader.files.each do |file|
  AprilFirst2014QuestionParser.new(file.data, file.doc.data.title).load!
end
