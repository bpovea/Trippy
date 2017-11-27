//namespace for our app

var app = {};
var siteRoot = 'http://localhost:8000'

//Modelos   
var Trip = Backbone.Model.extend({
  urlRoot: siteRoot+'/trips/'
});

var TripRequest = Backbone.Model.extend({
  urlRoot: siteRoot+'/tripRequests/'
});

var Passenger = Backbone.Model.extend({
  urlRoot: siteRoot+'/passengers/'
});

//var Cliente = Backbone.Model.extend();

//colecciones
var Trips = Backbone.Collection.extend({
  url: siteRoot+'/trips/'
});
var Drivers = Backbone.Collection.extend({
  url: siteRoot+'/drivers/'
});
var Vehicles = Backbone.Collection.extend({
  url: siteRoot+'/vehicles/'
});

var Profiles = Backbone.Collection.extend({
  url: siteRoot+'/profiles/'
});
var TripRequests = Backbone.Collection.extend({
  url: siteRoot+'/tripRequests/'
});


//Vistas

var TripRequestsList = Backbone.View.extend({
  el: '#tripRequest-board-here',
  render: function () {
    var that = this;
    var trips = new Trips();
    var tripRequests = new TripRequests();
    var drivers = new Drivers();
    var vehicles = new Vehicles();
    var profiles = new Profiles();
    profiles.fetch({
      success: function(profiles){
        tripRequests.fetch({
          success: function(tripRequests){
            vehicles.fetch({
              success: function(vehicles){
                drivers.fetch({
                  success: function(drivers){
                    trips.fetch({
                      success: function(trips){
                        var template = _.template($('#tripRequest-template').html());
                        that.$el.html(template({
                                                tripRequests : tripRequests.models,
                                                drivers : drivers.models, 
                                                trips : trips.models,
                                                vehicles : vehicles.models,
                                                profiles : profiles.models
                                              }));
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    })
  },
  events: {
    //'dragover .column-items' : 'saveClient',//mejor no usar jeje....
    'drop .column-items' : 'updatePassenger',//al insertarse en el area
    'click #button-trip-trash' : 'deleteTrip',
    'click #createNnewTrip' : 'newTrip',
    'click #newTripRequests' : 'newTripRequest'
    //'dragleave .column-items' : 'saveClient',//deja el area
    //'dragenter .column-items' : 'saveClient',//entra al area
  },
  updatePassenger: function(ev){
    //console.log($(ev.currentTarget));//padre de elemento
    //console.log($(ev.currentTarget.lastElementChild));//.attr('name'));//atributo name de elemento agregado
    //console.log($(ev.currentTarget).attr('id_trip'));
    if ($(ev.currentTarget).attr('id_trip')!=null){
      if($(ev.currentTarget.lastElementChild).attr('last_trip')==$(ev.currentTarget).attr('id_trip')){
        console.log("No actualizar pasajero");
      }else if($(ev.currentTarget.lastElementChild).attr('last_trip')=="none"){
        console.log("creando nuevo pasajero.");
        
        var user_newPassenger = $(ev.currentTarget.lastElementChild).attr('id_cliente');
        var trip_newPassenger = $(ev.currentTarget).attr('id_trip');
        var tripRequest_newPassenger = $(ev.currentTarget.lastElementChild).attr('id_solicitud'); 

        var passengerDetails = {
          "user":user_newPassenger,
          "tags":[1],
          "trip":trip_newPassenger,
          "trip_request":tripRequest_newPassenger,
          "created_user":1,//cambiar
          "modified_user":1//cambiar
        };

        var newPassenger = new Passenger();

        newPassenger.save(passengerDetails, {
          success: function(newPassenger){
            //$(ev.currentTarget.lastElementChild).attr('last_trip',trip_newPassenger); //update trip
            console.log("Passenger creado con éxito.");
            tripRequestsList.render();
          } 
        });
      }
      else{
        console.log("actualizando pasajero.");
        var newTripForPassenger = $(ev.currentTarget).attr('id_trip');
        var passenger_id = $(ev.currentTarget.lastElementChild).attr('passenger_id')
        var passenger = new Passenger({"id":passenger_id});
        passenger.fetch({
          success: function(passenger){
            console.log(newTripForPassenger);
            passenger.save({"trip":newTripForPassenger});
            //$(ev.currentTarget.lastElementChild).attr('last_trip',$(ev.currentTarget).attr('id_trip'));
            console.log("Passenger actualizado");
            tripRequestsList.render();
          }
        });
      }
    }else if($(ev.currentTarget.lastElementChild).attr('last_trip')!="none"){
      console.log("eliminando pasajero.");
      var passenger_id = $(ev.currentTarget.lastElementChild).attr('passenger_id')
      console.log(passenger_id);
      var passenger = new Passenger({"id":passenger_id});
      passenger.fetch({
        success: function(passenger){
          passenger.destroy({
            success: function(){
              //$(ev.currentTarget.lastElementChild).attr('last_trip',"none");
              console.log("Passenger eliminado");
              tripRequestsList.render();
            }
          });
        }
      });
    }else{
      console.log("No actualizar pasajero");
    }

  },
  deleteTrip: function(ev){
    console.log("delete:")
    //console.log($(ev.currentTarget).attr('trip_id'));//elemento usado
    var id = $(ev.currentTarget).attr('trip_id');
    var trip = new Trip({id: id});
      trip.fetch({
        success: function(trip){
          trip.destroy({
            success: function(){
              console.log("trip deleted");
              tripRequestsList.render();
            }
          });
        }
      });
  },
  newTrip: function(ev){
    var vehicleid = $("#newTripVehicle").val(); 
    var driverid = $("#newTripDriver").val();
    var d = new Date();
    var date = d.toString();
    var date_start = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
    console.log(date_start);

    var tripDetails = {
      "date_start":date_start,
      "date_end":null,//def
      "time_start":null,//def
      "time_end":null,//def
      "status":0,//default
      "created_at":date,
      "modified_at":date,
      "driver":driverid,
      "vehicle":vehicleid,
      "place_origin":null,
      "place_destination":null,
      "created_user":1,//cambiar
      "modified_user":1,//cambiar
      "passengers":[]// vacio por default
    };

    var trip = new Trip();

    trip.save(tripDetails, {
      success: function(trip){
        tripRequestsList.render();
      } 
    });

    //console.log("aceptar");
    //$('#new-trip-here').hide();
  },
  newTripRequest: function(ev){
    var user = $("#newTripRequestsUser").val(); 
    var shift = 1; //$("#newTripshift").val();
    var date = $("#newTripRequestsDate").val();
    var tripRequestDetails = {
      "user":user,
      "shift":shift,
      "tags":[1],
      "date_pickup":date,
      "date_arrive":date,//def
      "place_origin":3,
      "place_destination":2,
      "created_user":1,//cambiar
      "modified_user":1//cambiar
    };

    var newTripRequest = new TripRequest();

    newTripRequest.save(tripRequestDetails, {
      success: function(newTripRequests){
        console.log("Request creado con éxito.");
        tripRequestsList.render();
      } 
    });
  }
});

//Routers    
var Router = Backbone.Router.extend({
  routes: {
    '':'home'
  }
});


//--------------
// Initializers
//--------------

var tripRequestsList = new TripRequestsList();

var router = new Router();
router.on('route:home', function(){
  //console.log('Cargando home page');
  tripRequestsList.render();
});

//draggable

function allowDrop(ev) {
    ev.preventDefault();
    //console.log(ev.target);
    //console.log(ev.target.getAttribute("dropable"));
    if (ev.target.getAttribute("dropable") == "true")
        ev.dataTransfer.dropEffect = "all";
    else
        ev.dataTransfer.dropEffect = "none";
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    //console.log(data);//id elemento a transferir
    //console.log(ev.target);//target del lugar de destino
    //console.log(document.getElementById(data));//target de elemeto a tranferir
    ev.target.appendChild(document.getElementById(data));
}


Backbone.history.start();
