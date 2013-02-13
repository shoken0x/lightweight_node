# -*- encoding: utf-8 -*-

require 'mongo'
include Mongo

DATA_NUM = 400000    #400,000
COLL_NAME = 'keyword'

@client = MongoClient.new('localhost', 27017)
@db     = @client['lw']
@coll   = @db[COLL_NAME]

puts "create #{COLL_NAME}..."

def rand_str(digits)
  charset = ('a'..'z').to_a
  Array.new(digits){charset[rand(charset.size)]}.join
end

DATA_NUM.times do |i|
  @coll.insert({'keyword_id' => i+1,
                'bukken_id' => rand(1..50000),
                'keyword' => rand_str(5)
              })
  if i%1000 == 0
    puts i
  end
end

puts "There are #{@coll.count} records."
