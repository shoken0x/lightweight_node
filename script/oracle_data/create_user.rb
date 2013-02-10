# -*- encoding: utf-8 -*-
#
# 今回の検証では使用しない
#

require 'oci8'

DATA_NUM = 3000
TABLE = 'user_'

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
  user_id = i+1
  first_name = rand_str(8)
  last_name = rand_str(8)
  email = rand_str(10) + '@example.com'
  profile = rand_str(150)
  @conn.exec("insert into #{TABLE} values(#{user_id}, '#{first_name}', '#{last_name}', '#{email}', '#{profile}')")
end

@conn.commit

@conn.exec("select count(*) from #{TABLE}") do |r|
  puts r[0].to_i
end

@conn.logoff
