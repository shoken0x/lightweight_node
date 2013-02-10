# -*- encoding: utf-8 -*-

require 'oci8'
require 'time'

DATA_NUM = 36000000  # 36,000,000
TABLE = 'actionhistory'

@conn = OCI8.new('test', 'test', 'XE')

puts "insert #{TABLE}..."

def rand_time(d_from,d_to)
    from = Time.parse(d_from)
    to = Time.parse(d_to)
    days = to - from + 1
    return from + rand(days)
end

DATA_NUM.times do |i|
  ah_id = i+1
  user_id = rand(1..5000)
  bukken_id = rand(1..50000)
  created_at = rand_time("2003-01-01","2013-01-01").strftime("%Y-%m-%d %H:%M:%S")
  count = rand(1..10)
  @conn.exec("insert into \"#{TABLE}\" values( #{ah_id}, #{user_id}, #{bukken_id}, to_date('#{created_at}','yyyy-mm-dd hh24:mi:ss'), #{count})") 
end

@conn.commit

@conn.exec("select count(*) from \"#{TABLE}\"") do |r|
  puts r[0].to_i
end

@conn.logoff
