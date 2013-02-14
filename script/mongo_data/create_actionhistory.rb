# -*- encoding: utf-8 -*-

require 'mongo'
require 'time'
include Mongo

DATA_NUM = 3600000 #3,600,000
COLL_NAME = 'actionhistory'

@client = MongoClient.new('localhost', 27017)
@db     = @client['lw']
@coll   = @db[COLL_NAME]

puts "create #{COLL_NAME}..."

def rand_time(d_from,d_to)
    from = Time.parse(d_from)
    to = Time.parse(d_to)
    days = to - from + 1
    return from + rand(days)
end

DATA_NUM.times do |i|
  @coll.insert({'ah_id' => i+1,
                'user_id' => rand(1..300000),
                'bukken_id' => rand(1..50000), 
                'created_at' => rand_time("2003-01-01","2013-01-01"),
                'count' => rand(1..10)
              })
  if i%1000 == 0
    puts i
  end
end

puts "There are #{@coll.count} records."
