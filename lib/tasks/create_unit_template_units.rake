namespace :create_unit_template_units do
  desc 'create unit template units based on existing unit templates and units'

  task :create => :environment do
    create_unit_template_units
  end

  def create_unit_template_units
    ell_rec_equivalents = {
      'Articles' => 'Determiners',
      'Irregular Verbs' => 'Verb Tense',
      'Using Prepositions' => 'Prepositions',
      'Adverbs of Manner | BETA' => 'Adverbs',
      'Compound Subjects, Objects, and Predicates | BETA' => 'Subject Verb Agreement'
    }
    UnitTemplate.all.each do |ut|
      name_variations = [ut.name, ell_rec_equivalents[ut.name], ut.name.split(' | BETA').first]
      puts name_variations
      Unit.unscoped.where(name: name_variations).each do |u|
        if u.unit_template.nil?
          UnitTemplateUnit.create(unit_template_id: ut.id, unit_id: u.id)
        end
      end
    end
  end
end
