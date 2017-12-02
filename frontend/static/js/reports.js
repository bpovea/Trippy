var app = {};
var id_trip_detail;
var queryResult;
//var siteRoot = 'http://192.168.1.5:8000'
var siteRoot = 'http://localhost:8000'

//Models   
var Trip = Backbone.Model.extend({
  urlRoot: siteRoot+'/trips/'
});


//collections
var Trips = Backbone.Collection.extend({
  url: siteRoot+'/trips/'
});

var TripFilter = Backbone.Collection.extend({
  url: siteRoot+'/trips/filters/'
});

//Vistas

var TripQuery = Backbone.View.extend({
	el: '#content-here',
	render: function(){
		var template = _.template($('#query_result_TripRequest').html());
		this.$el.html(template({
  			trips : queryResult.models
	   }));
  },
  events: {
    'click .trip' : 'showDetails',
    'keyup #myInput' : 'filterByName'
  },
  showDetails: function(ev){
    id_trip_detail = $(ev.currentTarget).attr('id_trip');
    modalDetails.render();  
  },
  filterByName: function(ev){
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    tr = document.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      if(td[2] != null)
        if (td[2].innerText.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";

        }

      /*
      for (i = 0; i < td.length; i++) {
        a = td[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";

        }
      }
      */
    }
  }
});

var ModalDetails = Backbone.View.extend({
  el:"#modal-here",
  render: function(){
    var that = this;
    var trip = new Trip({id:id_trip_detail});
    trip.fetch({
      success: function(trip){
        var template = _.template($('#details_modal_template').html());
        that.$el.html(template({trip:trip.toJSON()}));
        $('#detailsModal').modal('show');
      }
    });
  }
});

var ModalFilter = Backbone.View.extend({
  el:"#modal-here",
  render: function(){
    var template = _.template($('#newQuery_modal_template').html());
    this.$el.html(template());
  },
  events: {
    'click #searchTrips' : 'searchTrips'
  },
  searchTrips: function(ev){
    var date_start = $('#desde').val();
    var date_end = $('#hasta').val();
    
    var qtrip = new TripFilter();
    qtrip.fetch({ 
      data: { 
              date_start: date_start,
              date_end: date_end
           },
      processData: true,
      success: function(qtrip){
        queryResult = qtrip;
        tripQuery.render()
      }
    });
    
  }
});

//initializers

var tripQuery = new TripQuery();
var modalDetails = new ModalDetails();
var modalFilter = new ModalFilter();

$( document ).ready(function() {
	$('#button-newQuery').click(function(){
    modalFilter.render();
		//  tripQuery.render();
	});

});