require 'time'


def rand_time(d_from,d_to)
    from = Time.parse(d_from)
    to = Time.parse(d_to)
    days = to - from + 1
    return from + rand(days)
end


puts rand_time("2003-01-01","2013-01-01")
