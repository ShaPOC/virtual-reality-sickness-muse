var sickness_socket = (function($, Handlebars){

    var self = {},
        /**
         * Required modules
         */
        socket = io.connect('http://localhost:8080'),
        /**
         * Private variables
         */
        body = null,
        battery = null,
        phases = null,
        phase_template = null,
        phase_table_template = null,
        phase = 0,
        data = [];

    // Constructor function called from within a document ready
    self.init = function() {

        // Save some jquery objects once
        body = $("body");
        battery = $("#battery i");
        phases = $("#phases");

        // Precompile some handlebars templates for efficiency
        phase_template = Handlebars.compile( $("#phase-template").html() );
        phase_table_template = Handlebars.compile( $("#phase-table-template").html() );
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

    self.setValue = function(key, value) {

        if($("#readability").hasClass("excellent")) {
            createPhaseObject();
            createValue(key);

            // Set min and max
            data[phase][key]["min"] = Math.min(data[phase][key]["min"], value);
            data[phase][key]["max"] = Math.max(data[phase][key]["max"], value);

            if(data[phase][key]["timer"] === null) {
                data[phase][key]["timer"] = setTimeout(calculateAverage, 5000, key);
            }

            // Push the buildup value to be calculated to the average
            data[phase][key]["buildup"].push(value);

            setTableValues(key);
        }

    };

    self.setCurrentPhase = function(newPhase) {

        // We make sure all average timers are cleared
        calculateAllAverages();
        // Heighten the current phase or set a specific one
        phase = newPhase || ++phase;
    };

    var setTableValues = function(key) {

        // Set the data in hte html
        data[phase][key]["element"].children(".min").html( data[phase][key]["min"] );
        data[phase][key]["element"].children(".max").html( data[phase][key]["max"] );
        data[phase][key]["element"].children(".average").html( data[phase][key]["average"] );
    };

    var calculateAverage = function(key) {

        var total = data[phase][key]["buildup"].reduce(function(a, b){return a+b;});
        data[phase][key]["average"] = total / data[phase][key]["buildup"].length;
        data[phase][key]["buildup"] = [];
    };

    var calculateAllAverages = function() {

        // Iterate through
        $.each(data[phase], function(key, value){
            clearTimeout(value.timer);
            calculateAverage(key);
        });
    };

    var createValue = function(key) {

        if( data[phase][key] ) {

            var elem = data[phase]["element"].append(phase_table_template({
                name : key,
                min : 0,
                average : 0,
                max : 0
            }));

            data[phase][key] = {
                min : null,
                max : null,
                average : null,
                buildup : [],
                element : $(elem),
                timer : null
            };
        }
    };

    var createPhaseObject = function() {

        if( data[phase] === null ) {
            var elem = phases.append(phase_template({
                phase : phase
            }));
            data[phase] = { element : $(elem) };
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

        self.setValue("EyeBlink", data.values);

    });

    socket.on('/muse/elements/jaw_clench', function(data){

        self.setValue("JawClench", data.values);

    });

    socket.on('/muse/elements/theta_absolute', function(data){

        self.setValue("Theta", data.values[0]);
        self.setValue("Theta", data.values[1]);
        self.setValue("Theta", data.values[2]);
        self.setValue("Theta", data.values[3]);

    });

    socket.on('/muse/elements/alpha_absolute', function(data){

        self.setValue("Alpha", data.values[0]);
        self.setValue("Alpha", data.values[1]);
        self.setValue("Alpha", data.values[2]);
        self.setValue("Alpha", data.values[3]);

    });

    socket.on('/muse/elements/beta_absolute', function(data){

        self.setValue("Beta", data.values[0]);
        self.setValue("Beta", data.values[1]);
        self.setValue("Beta", data.values[2]);
        self.setValue("Beta", data.values[3]);

    });

    socket.on('/muse/elements/experimental/concentration', function(data){

        self.setValue("Concentration", data.values);

    });

    socket.on('/muse/elements/experimental/mellow', function(data){

        self.setValue("Mellow", data.values);

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

})(jQuery, Handlebars);

/**
 * On ready, collect the elements
 */
$("document").ready(function(){

    sickness_socket.init();
});