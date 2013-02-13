# -*- encoding: utf-8 -*-

require 'oci8'

DATA_NUM = 400000  #400,000
TABLE = 'keyword'

@conn = OCI8.new('test', 'test', 'XE')

puts "insert #{TABLE}..."

def rand_str(digits)
  charset = ('a'..'z').to_a
  Array.new(digits){charset[rand(charset.size)]}.join
end

DATA_NUM.times do |i|
  keyword_id = i+1
  bukken_id = rand(1..50000)
  keyword = rand_str(5)
  @conn.exec("insert into \"#{TABLE}\" values( #{keyword_id}, #{bukken_id}, '#{keyword}')") 
  if i%1000 == 0
    puts i
  end
end

@conn.commit

@conn.exec("select count(*) from \"#{TABLE}\"") do |r|
  puts r[0].to_i
end

@conn.logoff
