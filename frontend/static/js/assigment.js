//namespace for our app
//global variables
var app = {};
//var siteRoot = 'http://192.168.1.5:8000'
var siteRoot = 'http://localhost:8000'

//dictionary for storing the selections data 
//comprising an array of the currently selected items 
//and a reference to the selected items' owning container
var selections = 
{
    items : [],
    owner : null
};

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
                        //exclude older browsers by the features we need them to support
                        //and legacy opera explicitly so we don't waste time on a dead browser
                        if
                        (
                            !document.querySelectorAll 
                            || 
                            !('draggable' in document.createElement('span')) 
                            || 
                            window.opera
                        ) 
                        { return; }

                        //get the collection of draggable items and add their draggable attributes
                        for(var 
                            items = document.querySelectorAll('[data-draggable="item"]'), 
                            len = items.length, 
                            i = 0; i < len; i ++)
                        {
                            items[i].setAttribute('draggable', 'true');
                            items[i].setAttribute('aria-grabbed', 'false');
                            items[i].setAttribute('tabindex', '0');
                        }
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  },
  events: {
    //'dragover .column-items' : 'saveClient',//mejor no usar jeje....
    'drop .column-items' : 'updatePassenger',//al insertarse en el area
    'click #button-trip-trash' : 'deleteTrip',
    'click #createNnewTrip' : 'newTrip',
    'click #newTripRequests' : 'newTripRequest',
    'click #button-trip-notification' : 'sendNotifications',
    'mousedown' : 'mousedown',
    'mouseup' : 'mouseup'
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
  },
  sendNotifications: function(ev){
    console.log("enviando notificaciones.");
    //console.log($(ev.currentTarget).attr('trip_id'));//elemento usado
    var id = $(ev.currentTarget).attr('trip_id');
    var trip = new Trip({id: id});
    trip.fetch({
      success: function(trip){
        trip.save({"notified":"True"});
        console.log("Enviado correctamete.");
      }
    });
  },
  //mousedown event to implement single selection
  mousedown: function(e){
    //console.log("mousedown");
    var element = e.target;
    //5 como maximo veces para econtrar si tiene un padre dragable
    try
    {
      for (i=0; i<5; i++){
        if(element.getAttribute('draggable'))
          break;
        else
          element = element.parentNode;
      }
      //if the element is a draggable item
      if(element.getAttribute('draggable')){
        console.log("here1");
        //if the multiple selection modifier is not pressed 
        //and the item's grabbed state is currently false
        if
        (
            !hasModifier(e) 
            && 
            element.getAttribute('aria-grabbed') == 'false'
        )
        {
            //clear all existing selections
            clearSelections();
        
            //then add this new selection
            addSelection(element);
        }
      }
      //else [if the element is anything else]
      //and the selection modifier is not pressed 
      else if(!hasModifier(e))
      {
        //clear all existing selections
        clearSelections();
      }
    }catch(err){
      //console.log("no, sorry");
    }
  },
  //mouseup event to implement multiple selection
  mouseup: function(e){
    //console.log("mouseup");
    //console.log(e.ctrlKey);
    var element = e.target;
    try{
      //5 como maximo veces para econtrar si tiene un padre dragable
      for (i=0; i<5; i++){
        if(element.getAttribute('draggable'))
          break;
        else
          element = element.parentNode;
      }
      //if the element is a draggable item 
      //and the multipler selection modifier is pressed
      if
      (
          element.getAttribute('draggable') 
          && 
          hasModifier(e)
      )
      {
        //console.log("here2");
        //if the item's grabbed state is currently true
        if(element.getAttribute('aria-grabbed') == 'true')
        {
          //console.log('here2.1');
          //unselect this item
          removeSelection(element);
          //console.log('here2.2');
          //if that was the only selected item 
          //then reset the owner container reference            
          if(!selections.items.length)
          {
              selections.owner = null;
          }
          //console.log('here2.3');
        }
        
        //else [if the item's grabbed state is false]
        else
        {
          //console.log('here2.4');
          //add this additional selection
          addSelection(element);
        }
      }
    }catch(err){
      console.log("no, sorry");
    }
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


Backbone.history.start();

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



//---------------------Added-------------------------------

//function for selecting an item
function addSelection(item)
{
    //if the owner reference is still null, set it to this item's parent
    //so that further selection is only allowed within the same container
    if(!selections.owner)
    {
        selections.owner = item.parentNode;
    }
    
    //or if that's already happened then compare it with this item's parent
    //and if they're not the same container, return to prevent selection
    else if(selections.owner != item.parentNode)
    {
        return;
    }
            
    //set this item's grabbed state
    item.setAttribute('aria-grabbed', 'true');
    
    //add it to the items array
    selections.items.push(item);
}

//function for unselecting an item
function removeSelection(item)
{
    //reset this item's grabbed state
    item.setAttribute('aria-grabbed', 'false');
    
    //then find and remove this item from the existing items array
    for(var len = selections.items.length, i = 0; i < len; i ++)
    {
        if(selections.items[i] == item)
        {
            selections.items.splice(i, 1);
            break;
        }
    }
}

//function for resetting all selections
function clearSelections()
{
    //if we have any selected items
    if(selections.items.length)
    {
        //reset the owner reference
        selections.owner = null;

        //reset the grabbed state on every selected item
        for(var len = selections.items.length, i = 0; i < len; i ++)
        {
            selections.items[i].setAttribute('aria-grabbed', 'false');
        }

        //then reset the items array        
        selections.items = [];
    }
}

//shorctut function for testing whether a selection modifier is pressed
function hasModifier(e)
{
    return (e.ctrlKey || e.metaKey || e.shiftKey);
}



//--------------------------------------------------------------------------------
function initializeNewDragDrop()
{   
    //dragstart event to initiate mouse dragging
    document.addEventListener('dragstart', function(e)
    {
        //if the element's parent is not the owner, then block this event
        if(selections.owner != e.target.parentNode)
        {
            e.preventDefault();
            return;
        }
                
        //[else] if the multiple selection modifier is pressed 
        //and the item's grabbed state is currently false
        if
        (
            hasModifier(e) 
            && 
            e.target.getAttribute('aria-grabbed') == 'false'
        )
        {
            //add this additional selection
            addSelection(e.target);
        }
        
        //we don't need the transfer data, but we have to define something
        //otherwise the drop action won't work at all in firefox
        //most browsers support the proper mime-type syntax, eg. "text/plain"
        //but we have to use this incorrect syntax for the benefit of IE10+
        e.dataTransfer.setData('text', '');
    
    }, false);

}    
