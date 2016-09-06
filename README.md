# walk-in-shanghai
An interactive map for storing the moments

## GeoJson File Format

one geojson file represents a scenery, which composed by the following parts:

### Site

The site feature layer is an marker for creating nav bar and locating to a specific scenery.

    {
      "type": "Site",
      "properties": {
        "title": "武康路",
        "marker-size": "medium",
        "marker-color": "#e7857f",
        "marker-symbol": "heart"
      },
      "geometry": {
        "coordinates": [
          121.435,
          31.21
        ],
        "type": "Point"
      }
    }

### Sign

a "Sign" marker will be placed on the map without the effect of zooming. It could be used as the start-stop operator.

    {
      "type": "Sign",
      "properties": {
        "description": "start",
        "marker-size": "medium",
        "marker-color": "#e7857f",
        "marker-symbol": "circle"
      },
      "geometry": {
        "coordinates": [
          121.433330,
          31.205900
        ],
        "type": "Point"
      }
    }

### Path

If the scenery is a road, the "Path" object will be drawed during initial loading.

    {
       "type":"Path",
       "properties":{
          "title":"武康路",
          "description":"武康路全长1700米",
          "stroke":"#1087bf",
          "stroke-width":4,
          "stroke-opacity":1
       },
       "geometry":{
          "coordinates":[
             [
                121.4333,
                31.205942
             ],
             [
                121.433354,
                31.206134
             ],
             [
                121.433499,
                31.206364
             ]
          ],
          "type":"LineString"
       }
    }

### Spot

The "Spot" points will form a cluster group when zooming out.


    {
      "type": "Spot",
      "properties": {
        "id": "marker-ip212jtx0",
        "title": "grains",
        "description": "coffee ",
        "marker-size": "medium",
        "marker-color": "#e7857f",
        "marker-symbol": "cafe",
        "images": [
            [
                "http://youimg1.c-ctrip.com/target/fd/tg/g1/M08/82/16/CghzfFWX3aOAC8vfABIa8JcbLno411.jpg",
                "武康路是一条安静低调，充满历史文化气息的马路."
            ],
            [
                "http://file29.mafengwo.net/M00/4B/E0/wKgBpVVivPCAHIxAABAX35qfKF473.jpeg",
                "穿越上海百年的时光隧道."
            ],
            [
                "http://file29.mafengwo.net/M00/4B/FA/wKgBpVVivQuAPBzfABGCCTUcw-E35.jpeg",
                "高大的梧桐树，炎炎夏日绿色的遮盖."
            ]
         ]
      },
      "geometry": {
        "coordinates": [
          121.435275,
          31.21137
        ],
        "type": "Point"
      }
    }

