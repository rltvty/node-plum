var config = require('./house_config.json');
var createHash = require('sha.js');



module.exports.rooms = function() {
    var rooms = [];
    for(var i in config.rooms) {
        var room = config.rooms[i];
        rooms.push(room.room_name);
    }
    return rooms;
};

module.exports.room_props = function(room_name) {
    for(var i in config.rooms) {
        var room = config.rooms[i];
        if (room.room_name == room_name) {
            if ('lightpads' in room && room.lightpads.length > 0) {
                return {
                    load_id: room.load_id,
                    ip: room.lightpads[0].lightpad_ip,
                    port: room.lightpads[0].lightpad_port
                }
            }
            break;
        }
    }
    return null
};

module.exports.house_token = function() {
    var sha256 = createHash('sha256');
    return sha256.update(config.house_token, 'utf8').digest('hex')
};