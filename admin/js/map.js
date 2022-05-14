(function($, window, document, undefined) {

    'use strict';
    //eval(document.getElementById('polygons-data').value)
    function Design_Polygon(element, polygons) {
        this.polygons = polygons;//tab d'objet polygon
        this.init();
        this.completepolygonscordinates = [];
        this.drawingManager;
        this.selectedShape;
        this.map;
        this.obj;
        this.savedpolygon = new Array();
    }

    Design_Polygon.prototype = {

        init: function() {

            var poly_obj = this.obj = this;
            poly_obj.mapSetup();
            poly_obj.setupdrawingManager();
            poly_obj.newPolygonConfig();
            poly_obj.configSavedPolygon();
            poly_obj.drawSavedPolygon();
            var map = poly_obj.map;
            poly_obj.drawingManager.setMap(map);
            poly_obj.drawNewPolygon();
            poly_obj.polygon_event_handler();
            poly_obj.init_configuration();

        },
        mapSetup: function() {

            var poly_obj = this;
            poly_obj.map = new google.maps.Map(document.getElementById("dawzones_id"), {
					center: { lat: 40.779897, lng: -73.968565 },
					zoom: 11,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                      position: google.maps.ControlPosition.TOP_RIGHT,
                    },
                    fullscreenControl: true,
                    fullscreenControl: {
                        position: google.maps.ControlPosition.RIGHT_BOTTOM,
                      },
            });
        },
        polygon_event_handler: function() {
            var poly_obj = this;
            var map = poly_obj.map;
            google.maps.event.addListener(poly_obj.drawingManager, 'drawingmode_changed', function() {
                poly_obj.clearSelection(poly_obj);
            });
            google.maps.event.addListener(map, 'click', function() {
                poly_obj.clearSelection(poly_obj);
            });
            google.maps.event.addDomListener(document.querySelector('#dawp-shape-delete-container .bin'), 'click', function() {
                poly_obj.deleteSelectedShape(poly_obj);
            });
        },
        drawSavedPolygon: function() {
            var poly_obj = this;
            var onepolygondraw = this.savedpolygon;

            var showpolycoordinate = [];
            
            for (var i = 0, l = onepolygondraw.length; i < l; i++) {


                google.maps.event.addListener(onepolygondraw[i], 'click', function(event) {

                    $('.polygon_property').find('.bin-container').removeClass('hidden');
                    poly_obj.setSelection(this);

                    for (var i = 0; i < this.getPath().getLength(); i++) {
                        var values = this.getPath().getAt(i).toUrlValue(6).split(',');
                        var lat = values[0];
                        var lng = values[1];
                        var singlevertex = {
                            lat: lat,
                            lng: lng
                        };
                        showpolycoordinate.push(singlevertex);
                    }

/*                     $(".wpdap_fill_color").iris('color', this.format.fillColor);
                    $('.wpdap_stroke_color').iris('color', this.format.strokeColor);

                    $('#dawp_shape_stroke_weight').select2('destroy');
                    $('#dawp_shape_stroke_weight').val(this.format.strokeWeight).select2();


                    $('#dawp_shape_stroke_opacity').select2('destroy');
                    $('#dawp_shape_stroke_opacity').val(this.format.strokeOpacity).select2();

                    $('#dawp_shape_fill_opacity').select2('destroy');
                    $('#dawp_shape_fill_opacity').val(this.format.fillOpacity).select2();


                    if ($('#' + this.id).data('redirecturl')) {
                        $("#dawp_shape_click_url").val($('#' + this.id).data('redirecturl'));
                    } else {
                        $("#dawp_shape_click_url").val('');

                    }
                    if ($('#' + this.id).data('infomessage')) {
                        var savedhtmlmsg = $('#' + this.id).data('infomessage')
                        var decodedsavedhtmlmsg = window.atob(savedhtmlmsg);

                        $("#dawp_shape_click_message").val(decodedsavedhtmlmsg);
                    } else {
                        $("#dawp_shape_click_message").val('');
                    } */
                    
                    var setatcoordinate = [];
                    var insertatcoordinate = [];
                    var newshape = this.getPath();

                    google.maps.event.addListener(newshape, 'insert_at', function() {
                        for (var i = 0; i < poly_obj.selectedShape.getPath().getLength(); i++) {
                            var values = poly_obj.selectedShape.getPath().getAt(i).toUrlValue(6).split(',');
                            var lat = values[0];
                            var lng = values[1];
                            var singlevertex = {
                                lat: lat,
                                lng: lng
                            };
                            insertatcoordinate.push(singlevertex);
                        }
                        poly_obj.checkchangeattribute(poly_obj.selectedShape, 'resize', insertatcoordinate);
                        insertatcoordinate = [];
                    });
                    google.maps.event.addListener(newshape, 'set_at', function() {
                        for (var i = 0; i < poly_obj.selectedShape.getPath().getLength(); i++) {
                            var values = poly_obj.selectedShape.getPath().getAt(i).toUrlValue(6).split(',');
                            var lat = values[0];
                            var lng = values[1];
                            var singlevertex = {
                                lat: lat,
                                lng: lng
                            };
                            setatcoordinate.push(singlevertex);
                        }
                        poly_obj.checkchangeattribute(poly_obj.selectedShape, 'resize', setatcoordinate);
                        setatcoordinate = [];
                    });
                });
            }
        },
        newPolygonConfig: function(){

            var poly_obj = this;
            google.maps.event.addListener(poly_obj.drawingManager, 'polygoncomplete', function(polygon) {
                var singleonlycoordinate = [];
                for (var i = 0; i < polygon.getPath().getLength(); i++) {
                    var values = polygon.getPath().getAt(i).toUrlValue(6).split(',');
                    var lat = values[0];
                    var lng = values[1];
                    var singlevertex = {
                        lat: lat,
                        lng: lng
                    };
                    singleonlycoordinate.push(singlevertex);
                }
                var custompolyid = Math.floor((Math.random() * 10000000) + 1);
                var polygonOptions = poly_obj.drawingManager.get('polygonOptions');
                /* polygonOptions.id = custompolyid; */
                var final = {
                    'id': custompolyid,
                    'group': parseInt($('#delivery-area-id').text(), 10),
                    'coordinate': singleonlycoordinate,
                    'polygon_formatting': polygonOptions,
                    'popygon_all_properties': '',
                };
				
				$('.polygon_property').find('.bin-container').removeClass('hidden');
				poly_obj.setSelection(polygon);
				
                var existingpolygons = $("#polygons-data").val();
                if (existingpolygons.length > 2) {
                    var existingpolygonsArray = eval('(' + existingpolygons + ')');//IMPORTANT A MOFID ICI
                    for (var i = 0; i < existingpolygonsArray.length; i++) {
                        poly_obj.completepolygonscordinates.push(existingpolygonsArray[i]);
                    }
                }
                polygon.id = custompolyid;

                poly_obj.completepolygonscordinates.push(final);
                poly_obj.drawingManager.set('drawingMode');
            });
        },
        configSavedPolygon: function() {
            var setting = this.polygons;
            var poly_obj = this;
            var map = this.map;
            var savedpolygon = new Array();
            if (setting) {
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0, l = setting.length; i < l; i++) {

                    savedpolygon[i] = new google.maps.Polygon({
                        paths: $.makeArray(setting[i].coordinate),
                        strokeColor: document.getElementById('polygon-color').innerText,
                        fillColor: document.getElementById('polygon-color').innerText,
                        id: setting[i].id,
                        group: parseInt($('#delivery-area-id').text(), 10),
                    });

                    savedpolygon[i].setMap(map);
                    var mynewpoly = setting[i].coordinate;
                    var testarr = [];
                    for (var g = 0; g < mynewpoly.length; g++) {
                        testarr.push(new google.maps.LatLng(mynewpoly[g].lat, mynewpoly[g].lng));
                        bounds.extend(testarr[testarr.length - 1]);
                    }
                    map.fitBounds(bounds);
                    poly_obj.drawingManager.set('drawingMode');
                }
            }
            this.savedpolygon = savedpolygon;
        },
        drawNewPolygon: function() {

            var poly_obj = this;
            google.maps.event.addListener(poly_obj.drawingManager, 'overlaycomplete', function(e) {
                var newShape = e.overlay;
                newShape.type = e.type;
                if (e.type !== google.maps.drawing.OverlayType.MARKER) {
                    poly_obj.drawingManager.setDrawingMode(null);
                    var showpolycoordinate = [];
                    var insertatcoordinate = [];
                    var setatcoordinate = [];
                    google.maps.event.addListener(newShape.getPath(), 'set_at', function() {
                        for (var i = 0; i < newShape.getPath().getLength(); i++) {
                            var values = newShape.getPath().getAt(i).toUrlValue(6).split(',');
                            var lat = values[0];
                            var lng = values[1];
                            var singlevertex = {
                                lat: lat,
                                lng: lng
                            };
                            setatcoordinate.push(singlevertex);
                        }
                        poly_obj.newpolygresize(newShape, poly_obj.completepolygonscordinates, setatcoordinate);
                        setatcoordinate = [];
                    });
                    google.maps.event.addListener(newShape.getPath(), 'insert_at', function() {
                        for (var i = 0; i < newShape.getPath().getLength(); i++) {
                            var values = newShape.getPath().getAt(i).toUrlValue(6).split(',');
                            var lat = values[0];
                            var lng = values[1];
                            var singlevertex = {
                                lat: lat,
                                lng: lng
                            };
                            insertatcoordinate.push(singlevertex);
                        }
                        poly_obj.newpolygresize(newShape, poly_obj.completepolygonscordinates, insertatcoordinate);
                        insertatcoordinate = [];
                    });
                    google.maps.event.addListener(newShape, 'click', function(e) {
                        poly_obj.setSelection(newShape);
                        for (var i = 0; i < newShape.getPath().getLength(); i++) {
                            var values = newShape.getPath().getAt(i).toUrlValue(6).split(',');
                            var lat = values[0];
                            var lng = values[1];
                            var singlevertex = {
                                lat: lat,
                                lng: lng
                            };
                            showpolycoordinate.push(singlevertex);
                        }

                        $('.polygon_property').find('.bin-container').removeClass('hidden');
                    });
                } else {
                    google.maps.event.addListener(newShape, 'click', function(e) {
                        poly_obj.setSelection(newShape);
                    });
                    poly_obj.setSelection(newShape);
                }
            });
        },
        setupdrawingManager: function() {

            var poly_obj = this;
            var fillcolor = document.getElementById('polygon-color').innerText;
            var strolecolor = document.getElementById('polygon-color').innerText;

            poly_obj.drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        google.maps.drawing.OverlayType.POLYGON
                    ]
                },
                polygonOptions: {
                    fillColor: fillcolor,
                    strokeColor: strolecolor,
                    clickable: true,
                    editable: true,
                    draggable: false,
                    zIndex: 1
                }
            });

        },
        newpolygresize: function(newShape, completepolygonscordinates, insertatcoordinate) {
            for (var j = 0; j < completepolygonscordinates.length; j++) {
                if (newShape.id == completepolygonscordinates[j].id) {
                    completepolygonscordinates[j].coordinate = insertatcoordinate;
                }
            }
        },
        removeDoublePolygons: function(polygons){
            var idList = [];
            var newPolygons = [];

            for(var i=0;i<polygons.length;i++){
                if(!idList.includes(polygons[i].id)){
                    idList.push(polygons[i].id);
                    newPolygons.push(polygons[i]);
                }
            }
            return newPolygons;
        },
        init_configuration: function() {

            var poly_obj = this;
            var checkarea = true;

            $('#daw_options_form').submit(function(event) {

                var t = JSON.stringify(poly_obj.completepolygonscordinates);
                var existpoly = $("#polygons-data").val();

                if (t.length == 2 && existpoly.length > 0) {

                    var existingpolygonsArray = eval('(' + existpoly + ')');
                    existingpolygonsArray = poly_obj.removeDoublePolygons(existingpolygonsArray);
                    $("#polygons-data").val(JSON.stringify(existingpolygonsArray));
                } else {

                    poly_obj.completepolygonscordinates = poly_obj.removeDoublePolygons(poly_obj.completepolygonscordinates);
                    $("#polygons-data").val(JSON.stringify(poly_obj.completepolygonscordinates));
                    if (checkarea == false) {
                        event.preventDefault();
                    }
                }
                if (checkarea == false) {
                    event.preventDefault();
                }
            });

        },
        setSelection: function(shape) {
            var poly_obj = this;
            if (shape.type !== 'marker') {
                poly_obj.clearSelection(poly_obj);
                poly_obj.selectedShape = shape;
                shape.setEditable(true);
                $('.polygon_property').find('.bin-container').removeClass('hidden');
            }
            poly_obj.selectedShape = shape;

        },
        clearSelection: function(poly_obj = '') {
            var poly_obj = this;
            if (poly_obj.selectedShape) {
                if (poly_obj.selectedShape.type !== 'marker') {
                    poly_obj.selectedShape.setEditable(false);
                }
                poly_obj.selectedShape = null;
                $('.polygon_property').find('.bin-container').addClass('hidden');
            }
        },
        deleteSelectedShape: function(poly_obj = '') {
            var poly_obj = this;
            if (poly_obj.selectedShape) {
                poly_obj.selectedShape.setMap(null);
                for (var i = 0; i < poly_obj.completepolygonscordinates.length; i++) {
                    if (poly_obj.selectedShape.id == poly_obj.completepolygonscordinates[i].id) {
                        poly_obj.completepolygonscordinates.splice(i, 1);
                    }
                }
                poly_obj.checkchangeattribute(poly_obj.selectedShape, 'delete', 'nothing');
                $('.polygon_property').find('.bin-container').addClass('hidden');
            }
        },
        checkchangeattribute: function(onepolygondraw, attribute, value) {

            var existingpolygons = $("#polygons-data").val();
            if (existingpolygons) {
                var existingpolygonsArray = eval('(' + existingpolygons + ')');

                for (var j = 0; j < existingpolygonsArray.length; j++) {
                    if (onepolygondraw.id == existingpolygonsArray[j].id) {
                        if (attribute == 'delete') {
                            existingpolygonsArray.splice(j, 1);
                            $('.polygon_property').find('.bin-container').addClass('hidden');
                        }
                        if (attribute == 'resize') {
                            existingpolygonsArray[j].coordinate = value;
                        }
                    }
                }
                $("#polygons-data").val(JSON.stringify(existingpolygonsArray));
            }
        }
    };

    $.fn.Design_Polygon = function(options) {
        if (typeof window.google !== "undefined") {
            new Design_Polygon(this, options);
        }
    };

    jQuery(document).ready(function($) {

        var daw_backend_obj = [];

        if($("#polygons-data").val() != ''){
            var oldObj = JSON.parse($("#polygons-data").val());
            for(let i=0;i<oldObj.length;i++){
                for(let o=0;o<oldObj[i].coordinate.length;o++){
                    oldObj[i].coordinate[o].lat = parseFloat(oldObj[i].coordinate[o].lat);
                    oldObj[i].coordinate[o].lng = parseFloat(oldObj[i].coordinate[o].lng);
                }
                daw_backend_obj.push(oldObj[i]);
            }
        }
        
		new Design_Polygon(this, daw_backend_obj);

    });



})(jQuery, window, document);