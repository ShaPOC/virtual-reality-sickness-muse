var sickness_socket = (function($){

    var self = {},
        /**
         * Required modules
         */
        socket = io.connect('http://localhost:8080'),
        body = null,
        battery = null;

    // Constructor function called from within a document ready
    self.init = function() {

        body = $("body");
        battery = $("#battery i");
    };

    /**
     * General methods used
     */
    self.setState = function(state) {

        if( body != null ) {
            body.removeClass("connected uncertain disconnected");
            body.addClass(state);
        }
    };

    /**
     * Connection states received by the socket
     */
    socket.on('muse_connected', function(data){
        self.setState("connected");
        if(data.config != null) {
            battery.attr("data-percentage", data.config.battery_percent_remaining).parent().attr("data-percentage", data.config.battery_percent_remaining);
        }
    });

    socket.on('muse_uncertain', function(){
        self.setState("uncertain");
    });

    socket.on('muse_disconnected', function(){
        self.setState("disconnected");
    });

    socket.on('disconnect', function(){
        self.setState("disconnected");
    });

    socket.on('connected', function (data) {
        if( data.connected ) {
            self.setState("connected");
            if(data.config != null)
                battery.attr("data-percentage", data.config.battery_percent_remaining).parent().attr("data-percentage", data.config.battery_percent_remaining);
        }
    });

    /**
     * Specific data received by the socket
     */

    // Set the readability values
    socket.on('/muse/elements/horseshoe', function(data){

        var excellence_counter = 0;
        for(var i in data.values) {
            $("#readability-bar-" + i).css("width", ( 100 / data.values[i] - (( 100 / data.values[i] <= 25 ) ? 25 : 0) ) + "%");
            if(data.values[i] <= 1) {
                excellence_counter++;
            }
        }
        if(excellence_counter > 3) {
            $("#readability").addClass("excellent");
        } else {
            $("#readability").removeClass("excellent");
        }

    });

    // Get the battery value
    socket.on('/muse/batt', function(data){
        // Set percentage values
        battery.attr("data-percentage", Math.round(data.values[0] / 100)).parent().attr("data-percentage",  Math.round(data.values[0] / 100));

    });

    socket.on('/muse/elements/blink', function(data){

        console.log('Eye blink: ' + data.values);

    });

    socket.on('/muse/elements/jaw_clench', function(data){

        console.log('Jaw Clench: ' + data.values);

    });

    socket.on('/muse/elements/theta_absolute', function(data){

        console.log('Absolute Band Powers: Theta: ' + data.values);

    });

    socket.on('/muse/elements/alpha_absolute', function(data){

        console.log('Absolute Band Powers: Alpha: ' + data.values);

    });

    socket.on('/muse/elements/beta_absolute', function(data){

        console.log('Absolute Band Powers: Beta: ' + data.values);

    });

    socket.on('/muse/elements/experimental/concentration', function(data){

        console.log('Concentration: ' + data.values);

    });

    socket.on('/muse/elements/experimental/mellow', function(data){

        console.log('Mellow: ' + data.values);

    });

    // Now ask for all the data
    socket.emit('setPaths',
        [
            '/muse/batt',
            '/muse/elements/horseshoe',
            '/muse/elements/blink',
            '/muse/elements/jaw_clench',
            '/muse/elements/theta_absolute',
            '/muse/elements/alpha_absolute',
            '/muse/elements/beta_absolute',
            '/muse/elements/experimental/concentration',
            '/muse/elements/experimental/mellow'
        ]
    );

    return self;

})(jQuery);

/**
 * On ready, collect the elements
 */
$("document").ready(function(){

    sickness_socket.init();
});