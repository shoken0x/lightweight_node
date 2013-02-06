# -*- encoding: utf-8 -*-

require 'mongo'
include Mongo

DATA_NUM = 3000000 
COLL_NAME = 'user'

@client = MongoClient.new('localhost', 27017)
@db     = @client['lw']
@coll   = @db[COLL_NAME]

puts "create #{COLL_NAME}..."

def rand_str(digits)
  charset = ('a'..'z').to_a + ('A'..'Z').to_a + ('0'..'9').to_a
  Array.new(digits){charset[rand(charset.size)]}.join
end

def rand_num(digits)
  numset = ('0'..'9').to_a
  Array.new(digits){numset[rand(numset.size)]}.join
end

DATA_NUM.times do |i|
  @coll.insert({'user_id' => i+1,
                'first_name' => rand_str(8),
                'last_name' => rand_str(8),
                'email' => rand_str(10) + '@example.com',
                'profile' => rand_str(150)
              })
end

puts "There are #{@coll.count} records."
