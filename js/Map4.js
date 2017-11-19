var map;
var LinkID;
var today = '2017-11-13';
var canvas =[];
var para =[];
var title = [];

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 38.91, lng: -94.620007},
          zoom: 12,
 //         styles: mapStyle
        });

        map.data.setStyle(styleFeature);
        var infowindow = new google.maps.InfoWindow();
        map.data.addListener('click', function(event) {
            
        map.data.overrideStyle(event.feature, {fillColor: 'red'});
        LinkID = event.feature.getProperty("Link_ID");
        infowindow.setContent('Link ID : '+LinkID);
        infowindow.setPosition(event.feature.getGeometry().get());
        infowindow.setOptions({pixelOffset: new google.maps.Size(0,-30)});
        infowindow.open(map);
        var url1 = '../data/comparison/';
        var url_sp = '_treps_speed_2017-11-13.csv';
        var url_vol='_treps_volume_2017-11-13.csv';
        var DataUrl = url1.concat(LinkID,url_sp);
        para = 'sp';
        title1 = 'Speed';
        canvas = 'chartdiv';
        var chart = getChart(DataUrl, para, canvas, title1);
        para2 = 'vol';
        canvas2 = 'chartdiv2'
        title2 = 'Volume';
        var DataUrl2 = url1.concat(LinkID,url_vol);
        var chart2 = getChart(DataUrl2, para2, canvas2, title2);
            
            
        var url2 = '../data/error/';
        var url_sper = '_Speed_err_2017-11-13.csv';
        var url_voler = '_Vol_err_2017-11-13.csv';
        var histURL =url2.concat(LinkID,url_sper);
        var histURL_vol =url2.concat(LinkID,url_voler);

        para3 = 'sp';
        canvas3 = 'myHist';
        para4 = 'vol';
        canvas4 = 'myHist2';
        var hist = getHist(histURL, para3, canvas3, title1);
        var hist2 = getHist(histURL_vol, para4, canvas4, title2);        
        });

        // Get the earthquake data (JSONP format)
        // This feed is a copy from the USGS feed, you can find the originals here:
        //   http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
        var script = document.createElement('script');
        script.setAttribute(
            'src',
            'data/Detector_call.json');
        document.getElementsByTagName('head')[0].appendChild(script);
      }

      // Defines the callback function referenced in the jsonp file.
      function data_callback(data) {
        map.data.addGeoJson(data);
      }

      function styleFeature(feature) {
        var low = [151, 83, 34];   // color of mag 1.0
        var high = [5, 69, 54];  // color of mag 6.0 and above
        var minMag = 0.0;
        var maxMag = 4.0;

        // fraction represents where the value sits between the min and max
        var fraction = (Math.min(feature.getProperty('abs_mean_sp_15min')/5, maxMag) - minMag) /
            (maxMag - minMag);

        var color = interpolateHsl(low, high, fraction);

        return {
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            strokeWeight: 0.5,
            strokeColor: '#fff',
            fillColor: color,
            fillOpacity: 2 / (feature.getProperty('abs_mean_sp_15min')/10),
            // while an exponent would technically be correct, quadratic looks nicer
            scale: Math.pow(Math.max(Math.min((15-Math.abs(feature.getProperty('abs_mean_sp_15min')))/3, 5),3), 2)
          },
          zIndex: Math.floor(feature.getProperty('abs_mean_sp_15min')/10)
        };
      }

      function interpolateHsl(lowHsl, highHsl, fraction) {
        var color = [];
        for (var i = 0; i < 3; i++) {
          // Calculate color based on the fraction.
          color[i] = (highHsl[i] - lowHsl[i]) * fraction + lowHsl[i];
        }

        return 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)';
      }

      var mapStyle = [{
        'featureType': 'all',
        'elementType': 'all',
        'stylers': [{'visibility': 'off'}]
      }, {
        'featureType': 'landscape',
        'elementType': 'geometry',
        'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
      }, {
        'featureType': 'water',
        'elementType': 'labels',
        'stylers': [{'visibility': 'off'}]
      }, {
        'featureType': 'water',
        'elementType': 'geometry',
        'stylers': [{'visibility': 'on'}, {'hue': '#5f94ff'}, {'lightness': 60}]
      }];


    function getChart(DataUrl, para, canvas, title) { AmCharts.loadFile(DataUrl, {}, function( response ) {

  /**
   * Parse CSV
   */
  var data = AmCharts.parseCSV( response, {
    "useColumnNames": true
  } );
  
  console.log(data);

  /**
   * Create the chart
   */
  var chart = AmCharts.makeChart( canvas, {
    "type": "serial",
    "dataProvider": data,
	"dataDateFormat": "HH:NN",
    "valueAxes": [ {
      "gridColor": "#FFFFFF",
      "gridAlpha": 0.5,
      "dashLength": 0,
        "minimum" :0,
        "maximum" : 100
    } ],

//    "startDuration": 1,
    "graphs": [ {
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "valueField": para.concat('_det'),
        "title":"Detector"
    },
        {
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "valueField": para.concat("_pred_15"),
        "title":"15 min prediction"
    }   
               ,
        {
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "valueField": para.concat("_pred_30"),
        "title":"30 min prediction"
    }
               ,
        {
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "valueField": para.concat("_pred_45"),
        "title":"45 min prediction"
    }
               ,
        {
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "valueField": para.concat("_pred_60"),
        "title":"60 min prediction"
    }
               ,
        {
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "valueField": para.concat("_pred_75"),
        "title":"75 min prediction"
    } ,
        {
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "valueField": para.concat("_pred_90"),
        "title":"90 min prediction"
    }
               ,
        {
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "valueField": para.concat("_pred_105"),
        "title":"105 min prediction"
    },
        {
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "valueField": para.concat("_pred_120"),
        "title":"120 min prediction"
    }  
              ],
    "titles": [
    {
      "size": 15,
      "text": LinkID.concat(' ',title,', Date : ',today)
    }
  ],
    "legend": {
		"enabled": true,
		"useGraphSettings": true
	},
    "chartCursor": {
        "enabled":true,
      "categoryBalloonDateFormat": "JJ:NN"
    },
    "categoryField": "date",
    "categoryAxis": {
        "minPeriod":"mm",
        "parseData":true,
        "autoGridCount":false
//        "gridPosition": "start",
//        "gridAlpha": 0,
//        "tickPosition": "start",
//        "tickLength": 1
    },
    "valueScrollbar": {
		"enabled": true,
		"autoGridCount": true,
		"graphType": "line",
		"hideResizeGrips": true,
		"minimum": -1
	},
    "chartScrollbar":{
      "enabled":true  
    },
      
    
    "export":{
        "enabled":true
    }
  } );

} );
};

   function getHist(URL, para, canvas, title){ Plotly.d3.csv(URL, function(err, rows){
            
        function unpack(row,key){
            return rows.map(function(row){return row[key];});
        }
        
        
            
//        for (var i = 1; i < 500; i++) 
//        {
//            k=Math.random();
//            x1.push(Math.random() + 1);
//            x2.push(Math.random() + 1.1);
//        }
       
        var col = 'abs_error_';
        var trace1 = {
            type: "histogram",
            histnorm: 'probability',
            name : "15 min prediction",
            opacity: 0.5,
            x: unpack(rows, col.concat(para,'_15min'))
//            marker: {
//            color: 'green',
//            },
        };
        var trace2 = {
          x: unpack(rows, col.concat(para,'_30min')),
        name : "30 min prediction",
          type: "histogram",
        	histnorm: 'probability',
          opacity: 0.5
//            marker: {
//            color: 'red',
//            },
        };
        var trace3 = {
          x: unpack(rows, col.concat(para,'_45min')),
        name : "45 min prediction",
          type: "histogram",
        	histnorm: 'probability',
          opacity: 0.5
//            marker: {
//            color: 'red',
//            },
        };
        var trace4 = {
          x: unpack(rows, col.concat(para,'_60min')),
        name : "60 min prediction",
          type: "histogram",
        	histnorm: 'probability',
          opacity: 0.5
//            marker: {
//            color: 'red',
//            },
        };
        var trace5 = {
          x: unpack(rows, col.concat(para,'_75min')),
        name : "75 min prediction",
          type: "histogram",
        	histnorm: 'probability',
          opacity: 0.5
//            marker: {
//            color: 'red',
//            },
        };
        var trace6 = {
          x: unpack(rows, col.concat(para,'_90min')),
        name : "90 min prediction",
          type: "histogram",
        	histnorm: 'probability',
          opacity: 0.5
//            marker: {
//            color: 'red',
//            },
        };
        var trace7 = {
          x: unpack(rows, col.concat(para,'_105min')),
        name : "105 min prediction",
          type: "histogram",
        	histnorm: 'probability',
          opacity: 0.5
//            marker: {
//            color: 'red',
//            },
        };
        var trace8 = {
          x: unpack(rows, col.concat(para,'_120min')),
        name : "120 min prediction",
          type: "histogram",
        	histnorm: 'probability',
          opacity: 0.5
//            marker: {
//            color: 'red',
//            },
        };
        var data = [trace1, trace2, trace3, trace4, trace5, trace6, trace7, trace8];
        var layout = {
                        title: title.concat(' Error Distribution'),
                        barmode: "overlay",
                        xaxis: {
                            title: 'Error',
                            range: [-50, 50]},
                        yaxis: {
                            title : 'Density',
                            range: [0, 0.8]}                     
                     };

        var Hist = Plotly.newPlot(canvas, data, layout);
    })
}