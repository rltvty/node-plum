
var bedroomToBathroomCurve = {
    0: 1,
    15: 1,
    37: 1,
    47: 25,
    63: 50,
    127: 127,
    255: 255
};

function getBathroomLevelFromBedroomLevel (bedroomLevel) {
    var x1 = 0, x2 = 255, y1 = bedroomToBathroomCurve[0], y2 = 255;
    for (var x in bedroomToBathroomCurve) {
        var y = bedroomToBathroomCurve[x];

        if (x <= bedroomLevel) {
            x1 = x;
            y1 = y;
        } else {
            x2 = x;
            y2 = y;
            break;
        }
    }

    if (x1 == x2) {
        return y1;
    }

    var m = (y2 - y1)/(x2 - x1);

    if (m == 0) {
        return y1;
    }

    var b = (y1 - (m * x1));

    return Math.ceil((bedroomLevel * m) + b);
}
