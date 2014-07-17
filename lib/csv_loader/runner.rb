require './csv_loader/parser'
require './csv_loader/loader'

loader = GoogleDriveLoader.new

Activity.flag_all(:archived)
Rule.flag_all(:archived)

class NoisyMethods
  def initialize proxy
    @proxy = proxy
  end

  def method_missing meth, *args, &block
    puts "Calling #{meth}"
    @proxy.send meth, *args, &block
  end
end

loader.files.each do |file|
  NoisyMethods.new(
    AprilFirst2014QuestionParser.new(file.data, file.doc.data.title)
  ).load!
end
