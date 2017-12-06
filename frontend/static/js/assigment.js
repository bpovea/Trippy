//namespace for our app
//global variables
var app = {};
//var siteRoot = 'http://192.168.1.5:8000'
var siteRoot = 'http://localhost:8000'

//dictionary for storing the selections data 
//comprising an array of the currently selected items 
//a reference to the selected items' owning container
//and a refernce to the current drop target container
var selections = 
{
    items      : [],
    owner      : null,
    droptarget : null
};

var items;
var targets;
var droptarget;

//related variable is needed to maintain a reference to the 
//dragleave's relatedTarget, since it doesn't have e.relatedTarget
var related = null;


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

                        //get the collection of draggable targets and add their draggable attribute
                        for(
                            targets = document.querySelectorAll('[data-draggable="target"]'), 
                            len = targets.length, 
                            i = 0; i < len; i ++)
                        {
                            targets[i].setAttribute('aria-dropeffect', 'none');
                        }

                        //get the collection of draggable items and add their draggable attributes
                        for(
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
    //'drop .column-items' : 'updatePassenger',//al soltarce en el area
    'click #button-trip-trash' : 'deleteTrip',
    'click #createNnewTrip' : 'newTrip',
    'click #newTripRequests' : 'newTripRequest',
    'click #button-trip-notification' : 'sendNotifications',
    'mousedown' : 'mousedown',
    'mouseup' : 'mouseup',
    'dragstart' : 'dragstart',
    'dragenter' : 'dragenter',
    'dragleave' : 'dragleave',
    'dragover' : 'dragover',
    'dragend' : 'dragend'

    //'dragleave .column-items' : 'saveClient',//deja el area
    //'dragenter .column-items' : 'saveClient',//entra al area
  },
  updatePassenger: function(ev){
    //console.log($(ev.currentTarget));//padre de elemento
    //console.log($(ev.currentTarget.lastElementChild));//.attr('name'));//atributo name de elemento agregado
    //console.log($(ev.currentTarget).attr('id_trip'));
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
        alert("Notificaciones enviadas correctamete.");
      }
    });
  },
  //mousedown event to implement single selection
  mousedown: function(e){

    console.log("mousedown");
    
    var evento = e;
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
        //console.log("draggable");
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
        //clear dropeffect from the target containers
        clearDropeffects();

        //clear all existing selections
        clearSelections();
      }
      //else [if the element is anything else and the modifier is pressed]
      else
      {
          //clear dropeffect from the target containers
          clearDropeffects();
      }
      //console.log("\n\nselections:");
      //console.log(selections);
      //console.log("\n\n");
    }catch(err){
      //else [if the element is anything else]
      //and the selection modifier is not pressed 
      if(!hasModifier(evento))
      {
        //clear dropeffect from the target containers
        clearDropeffects();

        //clear all existing selections
        clearSelections();
      }
      //else [if the element is anything else and the modifier is pressed]
      else
      {
          //clear dropeffect from the target containers
          clearDropeffects();
      }
      console.log("no, sorry");
    }
  },
  //mouseup event to implement multiple selection
  mouseup: function(e){
    console.log("mouseup");
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
      //console.log("\n\nselections:");
      //console.log(selections);
      //console.log("\n\n");
    }catch(err){
      console.log("no, sorry");
    }
  },
  dragstart: function(e){
    console.log("dragstart launched");

    /*
    console.log("Evento");
    console.log(e);
    console.log(e.target);
    console.log(e.target.parentNode);

    console.log("e.originalEvent.dataTransfer NO EXISTE");
    console.log("Evento Original");
    console.log(e.originalEvent);
    console.log(e.originalEvent.target);
    console.log(e.originalEvent.target.parentNode);
    console.log(e.originalEvent.dataTransfer);
    */

    //console.log(e);
    //console.log(e.target);
    //console.log(e.target.parentNode);
    
    //if the element's parent is not the owner, then block this event
    if(selections.owner != e.target.parentNode)
    {
      //console.log("here 1");
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
        //console.log("here 2");
        addSelection(e.target);
    }
    
    //we don't need the transfer data, but we have to define something
    //otherwise the drop action won't work at all in firefox
    //most browsers support the proper mime-type syntax, eg. "text/plain"
    //but we have to use this incorrect syntax for the benefit of IE10+
    //console.log("here 3");
    e.originalEvent.dataTransfer.setData('text', '');
    
    //apply dropeffect to the target containers
    addDropeffects();
  },
  //----------------------------------------NUEVOS AGREGADOS----------------------------


  //dragenter event to set that variable
  dragenter: function(e){
    console.log("dragenter launch");
    //console.log(e.target);
    related = e.target;
  },
  //dragleave event to maintain target highlighting using that variable
  dragleave: function(e){
    console.log("dragleave launched")
    //get a drop target reference from the relatedTarget
    droptarget = getContainer(related);
    
    //if the target is the owner then it's not a valid drop target
    if(droptarget == selections.owner)
    {
        droptarget = null;
    }

    //if the drop target is different from the last stored reference
    //(or we have one of those references but not the other one)
    if(droptarget != selections.droptarget)
    {
        //if we have a saved reference, clear its existing dragover class
        if(selections.droptarget)
        {
            selections.droptarget.className = 
                selections.droptarget.className.replace(/ dragover/g, '');
        }
        
        //apply the dragover class to the new drop target reference
        if(droptarget)
        {
            droptarget.className += ' dragover';
        }
                
        //then save that reference for next time
        selections.droptarget = droptarget;
    }
  },
  //dragover event to allow the drag by preventing its default
  dragover: function(e){
    console.log("dragover launch");
    //if we have any selected items, allow them to be dragged
    if(selections.items.length)
    {
        e.preventDefault();
    }
  },
  //dragend event to implement items being validly dropped into targets,
  //or invalidly dropped elsewhere, and to clean-up the interface either way
  dragend: function(e){
    console.log("dragend launch");
    //if we have a valid drop target reference
    //(which implies that we have some selected items)
    //console.log("\n\nselections:");
    //console.log(selections.droptarget);
    //console.log(selections.items);
    //console.log("\n\n");
    if(selections.droptarget)
    {
        //append the selected items to the end of the target container
        for(var len = selections.items.length, i = 0; i < len; i ++)
        {
          selections.droptarget.appendChild(selections.items[i]);
          //added------------------------------------------------------------------
          //si tiene id_trip 
          if ($(selections.droptarget).attr('id_trip')!=null){
            if($(selections.items[i]).attr('last_trip')==$(selections.droptarget).attr('id_trip')){
              console.log("No actualizar pasajero - nunca llegará aquí 1");
            }else if($(selections.items[i]).attr('last_trip')=="none"){
              console.log("creando nuevo pasajero.");
              var user_newPassenger = $(selections.items[i]).attr('id_cliente');
              var trip_newPassenger = $(selections.droptarget).attr('id_trip');
              var tripRequest_newPassenger = $(selections.items[i]).attr('id_solicitud'); 

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
                  //tripRequestsList.render();
                } 
              });
            }else{
              console.log("actualizando pasajero.");
              var newTripForPassenger = $(selections.droptarget).attr('id_trip');
              var passenger_id = $(selections.items[i]).attr('passenger_id')
              var passenger = new Passenger({"id":passenger_id});
              passenger.fetch({
                success: function(passenger){
                  console.log(newTripForPassenger);
                  passenger.save({"trip":newTripForPassenger});
                  //$(ev.currentTarget.lastElementChild).attr('last_trip',$(ev.currentTarget).attr('id_trip'));
                  console.log("Passenger actualizado");
                  //tripRequestsList.render();
                }
              });
            }
          }
          //en caso contrario, cuando es el panel de solicitudes
          else if($(selections.items[i]).attr('last_trip')!="none"){
            console.log("eliminando pasajero.");
            var passenger_id = $(selections.items[i]).attr('passenger_id')
            var passenger = new Passenger({"id":passenger_id});
            passenger.fetch({
              success: function(passenger){
                passenger.destroy({
                  success: function(){
                    //$(ev.currentTarget.lastElementChild).attr('last_trip',"none");
                    console.log("Passenger eliminado");
                    //tripRequestsList.render();
                  }
                });
              }
            });
          }else{
            console.log("No actualizar pasajero - nunca llegará aquí 2");
          }

          //end added-------------------------------------------------------------------

        }

        //prevent default to allow the action            
        e.preventDefault();
        //actualiza la vista
        tripRequestsList.render();

    }else{
      console.log("No actualizar pasajero main");
    }

    //if we have any selected items
    if(selections.items.length)
    {
        //clear dropeffect from the target containers
        clearDropeffects();
    
        //if we have a valid drop target reference
        if(selections.droptarget)
        {
            //reset the selections array
            clearSelections();

            //reset the target's dragover class
            selections.droptarget.className = 
                selections.droptarget.className.replace(/ dragover/g, '');

            //reset the target reference
            selections.droptarget = null;
        }
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

//--------------------------second PART------------------------------

//function for applying dropeffect to the target containers
function addDropeffects()
{
    //apply aria-dropeffect and tabindex to all targets apart from the owner
    for(var len = targets.length, i = 0; i < len; i ++)
    {
        if
        (
            targets[i] != selections.owner 
            && 
            targets[i].getAttribute('aria-dropeffect') == 'none'
        )
        {
            targets[i].setAttribute('aria-dropeffect', 'move');
            targets[i].setAttribute('tabindex', '0');
        }
    }

    //remove aria-grabbed and tabindex from all items inside those containers
    for(var len = items.length, i = 0; i < len; i ++)
    {
        if
        (
            items[i].parentNode != selections.owner 
            && 
            items[i].getAttribute('aria-grabbed')
        )
        {
            items[i].removeAttribute('aria-grabbed');
            items[i].removeAttribute('tabindex');
        }
    }        
}

//function for removing dropeffect from the target containers
function clearDropeffects(aria)
{
    //if we have any selected items
    if(selections.items.length)
    {
        //reset aria-dropeffect and remove tabindex from all targets
        for(var len = targets.length, i = 0; i < len; i ++)
        {
            if(targets[i].getAttribute('aria-dropeffect') != 'none')
            {
                targets[i].setAttribute('aria-dropeffect', 'none');
                targets[i].removeAttribute('tabindex');
            }
        }

        //restore aria-grabbed and tabindex to all selectable items 
        //without changing the grabbed value of any existing selected items
        for(var len = items.length, i = 0; i < len; i ++)
        {
            if(!items[i].getAttribute('aria-grabbed'))
            {
                items[i].setAttribute('aria-grabbed', 'false');
                items[i].setAttribute('tabindex', '0');
            }
            else if(items[i].getAttribute('aria-grabbed') == 'true')
            {
                items[i].setAttribute('tabindex', '0');
            }
        }        
    }
}

//shortcut function for identifying an event element's target container
function getContainer(element)
{
    do
    {
        if(element.nodeType == 1 && element.getAttribute('aria-dropeffect'))
        {
            return element;
        }
    }
    while(element = element.parentNode);
    
    return null;
}

//-----------------------------------------------------------------------------

(function()
{

    //------------------ METODOS DEL TECLADO-------------------------
    
    //keydown event to implement selection and abort
    document.addEventListener('keydown', function(e)
    {
        //if the element is a grabbable item 
        if(e.target.getAttribute('aria-grabbed'))
        {
            //Space is the selection or unselection keystroke
            if(e.keyCode == 32)
            {
                //if the multiple selection modifier is pressed 
                if(hasModifier(e))
                {
                    //if the item's grabbed state is currently true
                    if(e.target.getAttribute('aria-grabbed') == 'true')
                    {
                        //if this is the only selected item, clear dropeffect 
                        //from the target containers, which we must do first
                        //in case subsequent unselection sets owner to null
                        if(selections.items.length == 1)
                        {
                            clearDropeffects();
                        }

                        //unselect this item
                        removeSelection(e.target);

                        //if we have any selections
                        //apply dropeffect to the target containers, 
                        //in case earlier selections were made by mouse
                        if(selections.items.length)
                        {
                            addDropeffects();
                        }
                
                        //if that was the only selected item
                        //then reset the owner container reference
                        if(!selections.items.length)
                        {
                            selections.owner = null;
                        }
                    }
                    
                    //else [if its grabbed state is currently false]
                    else
                    {
                        //add this additional selection
                        addSelection(e.target);

                        //apply dropeffect to the target containers    
                        addDropeffects();
                    }
                }

                //else [if the multiple selection modifier is not pressed]
                //and the item's grabbed state is currently false
                else if(e.target.getAttribute('aria-grabbed') == 'false')
                {
                    //clear dropeffect from the target containers
                    clearDropeffects();

                    //clear all existing selections
                    clearSelections();
            
                    //add this new selection
                    addSelection(e.target);

                    //apply dropeffect to the target containers
                    addDropeffects();
                }
                
                //else [if modifier is not pressed and grabbed is already true]
                else
                {
                    //apply dropeffect to the target containers    
                    addDropeffects();
                }
            
                //then prevent default to avoid any conflict with native actions
                e.preventDefault();
            }

            //Modifier + M is the end-of-selection keystroke
            if(e.keyCode == 77 && hasModifier(e))
            {
                //if we have any selected items
                if(selections.items.length)
                {
                    //apply dropeffect to the target containers    
                    //in case earlier selections were made by mouse
                    addDropeffects();

                    //if the owner container is the last one, focus the first one
                    if(selections.owner == targets[targets.length - 1])
                    {
                        targets[0].focus();
                    }
                    
                    //else [if it's not the last one], find and focus the next one
                    else
                    {
                        for(var len = targets.length, i = 0; i < len; i ++)
                        {
                            if(selections.owner == targets[i])
                            {
                                targets[i + 1].focus();
                                break;
                            }
                        }
                    }
                }                
        
                //then prevent default to avoid any conflict with native actions
                e.preventDefault();
            }
        }
        
        //Escape is the abort keystroke (for any target element)
        if(e.keyCode == 27)
        {
            //if we have any selected items
            if(selections.items.length)
            {
                //clear dropeffect from the target containers
                clearDropeffects();
                
                //then set focus back on the last item that was selected, which is 
                //necessary because we've removed tabindex from the current focus
                selections.items[selections.items.length - 1].focus();

                //clear all existing selections
                clearSelections();
                
                //but don't prevent default so that native actions can still occur
            }
        }
            
    }, false);  

    //teclado--------------------------------------------------------------------

    //keydown event to implement items being dropped into targets
    document.addEventListener('keydown', function(e)
    {
        //if the element is a drop target container
        if(e.target.getAttribute('aria-dropeffect'))
        {
            //Enter or Modifier + M is the drop keystroke
            if(e.keyCode == 13 || (e.keyCode == 77 && hasModifier(e)))
            {
                //append the selected items to the end of the target container
                for(var len = selections.items.length, i = 0; i < len; i ++)
                {
                    e.target.appendChild(selections.items[i]);
                }

                //clear dropeffect from the target containers
                clearDropeffects();
    
                //then set focus back on the last item that was selected, which is 
                //necessary because we've removed tabindex from the current focus
                selections.items[selections.items.length - 1].focus();

                //reset the selections array
                clearSelections();

                //prevent default to to avoid any conflict with native actions
                e.preventDefault();
            }
        }

    }, false);

})();
