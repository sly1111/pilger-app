function drawMap(id ,encode) {
  var decode = decodePolyline(encode)
  var pathMid = Math.floor(decode.length / 2);
  var map = new google.maps.Map(document.getElementById(id), {
    zoom: 10,
    center: decode[pathMid],
    mapTypeId: 'terrain'
  });
  
  var walkPath = new google.maps.Polyline({
    path: decode,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  
  walkPath.setMap(map);
}

function decodePolyline(encoded) {
  if (!encoded) {
    return [];
  }
  var poly = [];
  var index = 0, len = encoded.length;
  var lat = 0, lng = 0;
  
  while (index < len) {
    var b, shift = 0, result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result = result | ((b & 0x1f) << shift);
      shift += 5;
    } while (b >= 0x20);
    
    var dlat = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
    lat += dlat;
    
    shift = 0;
    result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result = result | ((b & 0x1f) << shift);
      shift += 5;
    } while (b >= 0x20);
    
    var dlng = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
    lng += dlng;
    
    var p = {
      lat: lat / 1e5,
      lng: lng / 1e5,
    };
    poly.push(p);
  }
  return poly;
}

$.each($('.activity-map'), function(index, map) {
  drawMap($(map).attr('id'), $(map).data('route'));
})
