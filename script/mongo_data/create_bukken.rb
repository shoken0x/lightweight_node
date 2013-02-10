# -*- encoding: utf-8 -*-

require 'mongo'
include Mongo


DATA_NUM = 50000   #50,000
COLL_NAME = 'bukken'

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
  kakaku = rand 5000000..90000000
  @coll.insert({'bukken_id' => i+1,
                'name' => rand_str(15),
                'category' => "新築一戸建て",
                'area_id' => rand(1..100),
                'eki_info' => rand_str(100),
                'description' => rand_str(100),
                'kakaku' => kakaku,
                'kakaku_disp' => (kakaku/10000).to_s + "万円",
                'tochimenseki' => rand_str(10),
                'image1' => '/images/b/main_1.jpeg',
                'image2' => '/images/b/sub_1.jpeg',
                'image3' => '/images/b/sub_2.jpeg',
                'image4' => '/images/b/foot_1.jpeg',
                'image5' => '/images/b/foot_2.jpeg',
                'image6' => '/images/b/foot_3.jpeg'
              })
end

puts "There are #{@coll.count} records."
