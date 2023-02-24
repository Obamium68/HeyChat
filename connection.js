var Connection = require('tedious').Connection;  
    var config = {  
        server: 'materaaf.altervista.org',  //update me
        authentication: {
            type: 'default',
            options: {
                userName: 'materaaf', //update me
                password: 'vT5gsPXqy5TX'  //update me
            }
        },
        options: {
            database: 'my_materaaf'  //update me
        }
    };  
    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
        // If no error, then good to proceed.
        console.log("Connected");  
    });
    
    connection.connect();
