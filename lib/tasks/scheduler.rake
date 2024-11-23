desc "This task is called by the Heroku scheduler add-on"
task :prune_downloads => :environment do
    puts "Pruning downloads..."
    Download.where("created_at <= ?", 6.hours.ago).destroy_all
    puts "done."
end
