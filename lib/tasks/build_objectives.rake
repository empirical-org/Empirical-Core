namespace :objectives do
  desc 'create objectives'
  task :create => :environment do
    ObjectiveCreator::find_or_create_objectives
  end


  module ObjectiveCreator
    def self.data
       ['Create a Classroom',
        'Add Students',
        'Assign Featured Activity',
        'Build Your Own Activity Pack',
        'Add School']
    end

    def self.find_or_create_objectives
      data.map do |obj|
        Objective.find_or_create_by(name: obj)
      end
    end
  end
end
