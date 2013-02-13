# -*- encoding: utf-8 -*-

require 'oci8'

DATA_NUM = 50000  # 50,000
TABLE = 'bukken'

@conn = OCI8.new('test', 'test', 'XE')

puts "insert #{TABLE}..."

def rand_str(digits)
  charset = ('a'..'z').to_a + ('A'..'Z').to_a + ('0'..'9').to_a
  Array.new(digits){charset[rand(charset.size)]}.join
end

def rand_num(digits)
  numset = ('0'..'9').to_a
  Array.new(digits){numset[rand(numset.size)]}.join
end

DATA_NUM.times do |i|
  bukken_id = i+1
  name = rand_str(15)
  category = "新築一戸建て"
  area_id = rand(1..100)
  eki_info = rand_str(100)
  description = rand_str(100)
  kakaku = rand 5000000..90000000
  kakaku_disp = (kakaku/10000).to_s + "万円"
  tochimenseki = rand_str(10)
  image1 = '/images/b/main_1.jpeg'
  image2 = '/images/b/sub_1.jpeg'
  image3 = '/images/b/sub_2.jpeg'
  image4 = '/images/b/foot_1.jpeg'
  image5 = '/images/b/foot_2.jpeg'
  image6 = '/images/b/foot_3.jpeg'
  @conn.exec("insert into \"#{TABLE}\" values( #{bukken_id}, '#{name}', '#{category}', #{area_id}, '#{eki_info}', '#{description}', #{kakaku}, '#{kakaku_disp}', '#{tochimenseki}', '#{image1}', '#{image2}', '#{image3}', '#{image4}', '#{image5}', '#{image6}')")

  if i%1000 == 0
    puts i
  end
end

@conn.commit

@conn.exec("select count(*) from \"#{TABLE}\"") do |r|
  puts r[0].to_i
end

@conn.logoff
