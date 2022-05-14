(function($, window, document, undefined) {

    //Point in polygon

    function pointInPolygonFlat (point, vs, start, end) {
        var x = point[0], y = point[1];
        var inside = false;
        if (start === undefined) start = 0;
        if (end === undefined) end = vs.length;
        var len = (end-start)/2;
        for (var i = 0, j = len - 1; i < len; j = i++) {
            var xi = vs[start+i*2+0], yi = vs[start+i*2+1];
            var xj = vs[start+j*2+0], yj = vs[start+j*2+1];
            var intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };
    
    function pointInPolygonNested (point, vs, start, end) {
        var x = point[0], y = point[1];
        var inside = false;
        if (start === undefined) start = 0;
        if (end === undefined) end = vs.length;
        var len = end - start;
        for (var i = 0, j = len - 1; i < len; j = i++) {
            var xi = vs[i+start][0], yi = vs[i+start][1];
            var xj = vs[j+start][0], yj = vs[j+start][1];
            var intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };
    
    function pointInPolygon (point, vs, start, end) {
        if (vs.length > 0 && Array.isArray(vs[0])) {
            return pointInPolygonNested(point, vs, start, end);
        } else {
            return pointInPolygonFlat(point, vs, start, end);
        }
    }

    //CONTEXT
    function WooCheckoutMap(polygons) {

        this.map = new google.maps.Map(document.getElementById("daw-map"), {
            zoom: 8,
            center: { lat: 40.779897, lng: -73.968565 },
        });
        this.geocoder = new google.maps.Geocoder();
        this.polygons = polygons;
        this.marker;
    }

    WooCheckoutMap.prototype = {

        constructor: WooCheckoutMap(),

        debounce: function(callback, delay) {
            var timer = null;
            return function(){
                clearTimeout(timer);
                document.getElementById("daw-checkout-map-container").classList.add('loading');
                timer = setTimeout(function(){
                    callback();
                }, delay);
            }
        },

        drawAreas: function() {
            var polygons = this.polygons;
            var savedpolygon = new Array();
            if (polygons) {
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0, l = polygons.length; i < l; i++) {
    
                    savedpolygon[i] = new google.maps.Polygon({
                        paths: $.makeArray(polygons[i].coordinate),
                        strokeColor: polygons[i].color,
                        fillColor: polygons[i].color,
                        id: polygons[i].id
                    });
    
                    savedpolygon[i].setMap(this.map);
                    var mynewpoly = polygons[i].coordinate;
                    var testarr = [];
                    for (var g = 0; g < mynewpoly.length; g++) {
                        testarr.push(new google.maps.LatLng(mynewpoly[g].lat, mynewpoly[g].lng));
                        bounds.extend(testarr[testarr.length - 1]);
                    }
                    this.map.fitBounds(bounds); 
                }
            }
        },
    
        getAddressPart: function(label) {

            var toggleInputs = document.querySelector('#ship-to-different-address input');
            return toggleInputAddress = ( toggleInputs != null && toggleInputs.checked ) ? document.getElementById('shipping_' + label).value : document.getElementById('billing_' + label).value;
        },
    
        getAddress: function() {
            var address_1 = this.getAddressPart('address_1');
            var address_2 = this.getAddressPart('address_2');
            var postcode = this.getAddressPart('postcode');
            var city = this.getAddressPart('city');
            var state = this.getAddressPart('state');
            var country = this.getAddressPart('country');
    
            if(address_1 != '' && postcode != '' && city != '' && country != ''){
                address_1 = ', ' + address_1;
                address_2 = (address_2 != '') ? ', ' + address_2 : '';
                postcode = ', ' + postcode;
                city = ', ' + city;
                state = (state != '') ? ', ' + state : '';
                country = ', ' + country;
                
                var address = address_1 + address_2 + postcode + city + state + country;
                if(address[0] == ','){
                    address = address.slice(1);
                }
                while(address[0] == ' '){
                    address = address.slice(1);
                }
        
                return address;
            }else{
                return false;
            }
        },
    
        getPosition: function(result) {
            return [result.geometry.location.lat() , result.geometry.location.lng()];
        },
    
        addressInAreas: function(point, polygons){
            inAreas = [];
    
            if (polygons) {
                for(let i=0;i<polygons.length;i++){
                    //pour mettre comme array
                    polygon = polygons[i].coordinate;
                    polygon = Object.keys(polygon).map(key => [polygon[key].lat, polygon[key].lng]);
    
                    var inside = pointInPolygon(point, polygon);
    
                    if(inside){
                        inAreas.push(polygons[i].group);
                    }
                }
            }
    
            if(inAreas.length < 1){
                inAreas = false;
            }
    
            return inAreas;
        },
    
        removeMarker: function(){
            this.marker.setMap(null);
            this.marker = null;
        },
    
        updateMarker: function(location){
            if(this.marker != undefined){
                this.removeMarker();
            }
            this.marker = new google.maps.Marker({
                position: location,
                map: this.map
            });
        },
    
        getPositionState: function(inDeliveryAreas = "warning"){
            var state;
            if(inDeliveryAreas === "warning"){
                state = "warning";//on sait pas
            }else if(Array.isArray(inDeliveryAreas)){
                state = "valid";// dedans
            }else{
                state = "error";//dehors
            }
            return state;
        },
    
        updateDeliveryCheckoutNotice: function(state){
            document.getElementById('daw-checkout-notice').setAttribute('class', state);
        },
    
        updateGPFU: function(position = "false"){
            var GPFU = document.getElementById('wpda-gpfu');
            if(Array.isArray(position)){
                GPFU.value = position.join();
            }else{
                GPFU.value = position;
            }
        },
        
        controlPosition: function(){
            var address = this.getAddress();
            var deliveryTimeContainer = document.getElementById('daw-delivery-time');

            if(address != false){
                var context = this;
                this.geocoder.geocode( { 'address': address}, function(results, status) {
                    if (status == 'OK') {
                        context.map.setCenter(results[0].geometry.location);
                        context.updateMarker(results[0].geometry.location);
                    
                        var position = context.getPosition(results[0]);
                        var inDeliveryAreas = context.addressInAreas(position, context.polygons);
                    
                        var state = context.getPositionState(inDeliveryAreas);
                        context.updateDeliveryCheckoutNotice(state);
                        var deliveryTime = deliveryTimeContainer.querySelector('p');
                    
                        if(inDeliveryAreas != false){
                            deliveryTimeContainer.style.display = "block";
                        }else{
                            deliveryTimeContainer.style.display = "none";
                        }
    
                        context.updateGPFU(inDeliveryAreas);
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });
            }else{
                if(this.marker != undefined){
                    this.removeMarker();
                }
                /* this.map.fitBounds(this.bounds); */
                this.updateDeliveryCheckoutNotice(this.getPositionState("warning"));
                this.updateGPFU();
                deliveryTimeContainer.style.display = "none";
            }
            document.getElementById("daw-checkout-map-container").classList.remove('loading');
        },

        manageInputsAddressEvent(action, selectType, inputs, callback){
            if(action === "add"){

                for(let i=0;i<inputs.length;i++){
                    inputs[i].addEventListener('input', callback);
                }

                document.getElementById('select2-' + selectType + '_country-container').addEventListener('click', wooSelectEvent = ()=>{
                    var interval = setInterval(()=>{
                        if(document.getElementById('select2-' + selectType + '_country-results') == null){
                            callback();
                            clearInterval(interval);
                        }
                    }, 100);
                });

            }else if(action == "remove"){

                for(let i=0;i<inputs.length;i++){
                    inputs[i].removeEventListener('input', callback);
                }
                document.getElementById('select2-' + selectType + '_country-container').removeEventListener('click', wooSelectEvent);
            }

        },

        toggleListenersInputAddress: function(toggleInputAddress, billingAddressInputs, shippingAddressInputs, callback, firstCall = false){
            if( toggleInputAddress.checked ){
                //open
                if(firstCall == false){
                    this.manageInputsAddressEvent("remove", "billing", billingAddressInputs, callback);
                }
                callback();
                this.manageInputsAddressEvent("add", "shipping", shippingAddressInputs, callback);

            }else{
                //close
                if(firstCall == false){
                    this.manageInputsAddressEvent("remove", "shipping", shippingAddressInputs, callback);
                }
                callback();
                this.manageInputsAddressEvent("add", "billing", billingAddressInputs, callback);
            }
        }

    }

    jQuery(document).ready( ()=>{
        var checkoutMap = new WooCheckoutMap(dawDatas.polygons);
        checkoutMap.drawAreas();
        document.getElementById("daw-checkout-map-container").classList.add('loading');
        setTimeout(()=>{
            checkoutMap.controlPosition();
        },1000);
        

        var billingAddressInputs = [
            document.getElementById('billing_address_1'),
            document.getElementById('billing_address_2'),
            document.getElementById('billing_postcode'),
            document.getElementById('billing_city'),
            document.getElementById('billing_state'),
        ];

        var shippingAddressInputs = [
            document.getElementById('shipping_address_1'),
            document.getElementById('shipping_address_2'),
            document.getElementById('shipping_postcode'),
            document.getElementById('shipping_city'),
            document.getElementById('shipping_state'),
        ];

        var callback = checkoutMap.debounce(function(){
            checkoutMap.controlPosition();
        }, 2000);

        var toggleInputAddress = document.querySelector('#ship-to-different-address input');

        if(toggleInputAddress != null){
            checkoutMap.toggleListenersInputAddress(toggleInputAddress, billingAddressInputs, shippingAddressInputs, callback, true);
            toggleInputAddress.addEventListener('change', ()=>{
                checkoutMap.toggleListenersInputAddress(toggleInputAddress, billingAddressInputs, shippingAddressInputs, callback);
            });
        }else{
            checkoutMap.manageInputsAddressEvent("add", "billing", billingAddressInputs, callback);
        }

        //heredite
/*         document.getElementById('update-position').addEventListener('click', ()=>{
            checkoutMap.controlPosition();
        }); */
        
    });

})(jQuery, window, document);