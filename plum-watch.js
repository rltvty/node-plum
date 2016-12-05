var net = require('net');
var events = require('events');
var util = require('util');

module.exports.new = function(ip) {
    var myEmitter = new events.EventEmitter();

    var s = new net.Socket();

    s.on('close', function(had_error) {
        console.log('close, had_error: ' + had_error);
    });

    s.on('connect', function() {
        console.log('connect');
    });

    var last_response = '';

    s.on('data', function(data) {
        var datas = data.toString().split('\n');
        for (var i in datas) {
            var line = datas[i].trim();
            if (line != '') {
                line = line.substr(0, line.length - 1);
                if (last_response != line) {
                    last_response = line;
                    var parsed = JSON.parse(line);
                    switch (parsed.type) {
                        case 'power':
                            myEmitter.emit('power', parsed.watts);
                            break;
                        case 'pirSignal':
                            myEmitter.emit('motion', parsed.signal);
                            break;
                        case 'dimmerchange':
                            myEmitter.emit('level', parsed.level);
                            break;
                    }
                }
            }
        }
    });

    s.on('end', function() {
        console.log('end');
    });

    s.on('error', function(error) {
        console.log('error: ' + error);
    });

    s.on('timeout', function() {
        console.log('timeout');
    });

    s.connect({
        port: 2708,
        host: ip
    });

    return {
        end: function() {
            s.end();
        },
        destroy: function() {
            s.destroy();
        },
        on: function (key, callback) {
            myEmitter.on(key, callback);
        }
    };
};
