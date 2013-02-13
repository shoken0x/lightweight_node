# Usage

http://ruby-oci8.rubyforge.org/ja/ を参考にruby-oci8-2.1.4.tar.gzをインストール

```
wget http://rubyforge.org/frs/download.php/76658/ruby-oci8-2.1.4.tar.gz
tar zxfv ruby-oci8-2.1.4.tar.gz
cd ruby-oci8-2.1.4
make && make install
```

確認用データ
```
/u01/app/oracle/product/11.2.0/dbhome_1/bin/sqlplus test@XE
create table emp 
(
  "emp_id" char(3) ,
  "emp_name" varchar2(10),
  primary key( "emp_id" )
);
insert into emp values (1,'fujisaki');
```


確認
```ruby
ruby -r oci8 -e "OCI8.new('test', 'test').exec('select * from emp') do |r| puts r.join(','); end" 
```
