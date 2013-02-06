var oracle = require('db-oracle');

// USER
// CREATE USER test IDENTIFIED BY test;
// GRANT ALL PRIVILEGES TO test;

// TABLE
// create table emp
// (
// 　　emp_id char(3) ,
// 　　emp_name varchar2(10),
// 　　primary key( emp_id )
// );
// insert into emp values (1,'fujisaki');

new oracle.Database({
    hostname: 'localhost',
    user: 'test',
    password: 'test',
    database: 'XE'
}).connect(function(error) {
    if (error) {
        return console.log("CONNECTION ERROR: " + error);
    }

    this.query().select('*').from('EMP').execute(function(error, rows) {
        if (error) {
            return console.log('ERROR: ' + error);
        }
        console.log(rows.length + ' ROWS');
        console.log(rows[0]);
    });
});
