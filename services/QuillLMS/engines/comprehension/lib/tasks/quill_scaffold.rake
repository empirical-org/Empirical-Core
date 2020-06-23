namespace :quill_scaffold do

  desc "Generate a scaffold resource, uses syntax following rails scaffold generator passed in as the arg, e.g.o: bundle exec rake quill_scaffold:generate['FakeModel name:string level:integer activity:references']"

  task :generate, [:options] do |t, args|
    system("rails g quill_scaffold #{args[:options]} --force")
    system("rails g factory_bot:model #{args[:options]} --force")
    system("rails g quill_scaffold_controller #{args[:options]} --force")
    system("rails g quill_model #{args[:options]} --force")
    system("rails g model_tests #{args[:options]} --force")
    system("rails g controller_tests #{args[:options]} --force")
    system("rm -rf test/fixtures")
  end
end
