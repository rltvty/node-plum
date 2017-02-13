var config = require('./house_config.json');
var createHash = require('sha.js');

module.exports.rooms = function() {
    var rooms = [];
    for(var i in config.rooms) {
        var room = config.rooms[i];
        var lightpads = [];
        for (var j in room.lightpads) {
            var lightpad = room.lightpads[j];
            lightpads.push(lightpad.lightpad_hostname);
        }
        rooms.push({
            'name' : room.room_name,
            'controls' : lightpads
        });
    }
    return rooms;
};

module.exports.controls = function() {
    var lightpads = [];
    for(var i in config.rooms) {
        var room = config.rooms[i];
        for (var j in room.lightpads) {
            var lightpad = room.lightpads[j];
            lightpads.push({
                'id' : lightpad.lightpad_hostname,
                'room_name' : room.room_name
            });
        }
    }
    return lightpads;
};

module.exports.room_props = function(room_name) {
    for(var i in config.rooms) {
        var room = config.rooms[i];
        if (room.room_name == room_name) {
            if ('lightpads' in room && room.lightpads.length > 0) {
                return {
                    load_id: room.load_id,
                    ip: room.lightpads[0].lightpad_ip,
                    port: room.lightpads[0].lightpad_port,
                    host: room.lightpads[0].lightpad_hostname
                }
            }
            break;
        }
    }
    return null
};

module.exports.control_props = function(lightpad_hostname) {
    for(var i in config.rooms) {
        var room = config.rooms[i];
        if ('lightpads' in room && room.lightpads.length > 0) {
            for (var j in room.lightpads) {
                var lightpad = room.lightpads[j];
                if (lightpad.lightpad_hostname === lightpad_hostname) {
                    return {
                        load_id: room.load_id,
                        ip: lightpad.lightpad_ip,
                        port: lightpad.lightpad_port,
                        host: lightpad.lightpad_hostname
                    }
                }
            }
        }
    }
    return null
};

module.exports.all_ips = function() {
    var ips = [];
    for(var i in config.rooms) {
        var room = config.rooms[i];

        if ('lightpads' in room) {
            for (var j in room.lightpads) {
                ips.push({
                    room_name: room.room_name,
                    ip: room.lightpads[j].lightpad_ip,
                    host: room.lightpads[j].lightpad_hostname
                });
            }
        }
    }
    return ips;
};

module.exports.house_token = function() {
    var sha256 = createHash('sha256');
    return sha256.update(config.house_token, 'utf8').digest('hex')
};