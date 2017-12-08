var maindate = new Date();
var queryResult;
maindate.setDate(maindate.getDate()+1-maindate.getDate());
var app = {};
var siteRoot = 'http://localhost:8000'

var scheduler = ['12',
'10.30',
'4.30',
'21',
'12C',
'BOG',
'3.30',
'LD',
'V',
'17',
'C/17',
'C',
'15',
'21R',
'3.30/C',
'4.30/R'
]


//Models


//Collections
var Areas = Backbone.Collection.extend({
	url: siteRoot+'/areas/'
});

var ProfilesFilter = Backbone.Collection.extend({
	url: siteRoot+'/profiles/filter/'
});

//vistas
var AreasList=Backbone.View.extend({
	el:"#areasHere",
	render: function(){
		var that = this;
		var areas = new Areas();
		areas.fetch({
			success: function(areas){
				var template = _.template($("#areas_template").html());
				that.$el.html(template({areas:areas}));
			}
		});
	},
	events:{
		'click .area' : 'selectArea',
		'keyup #myInput' : 'filterByName'
	},
	selectArea: function(ev){
		var areaActive = document.getElementsByClassName("area active");
		if(areaActive.length != 0)
			$(areaActive).attr('class','area');
		$(ev.currentTarget).attr('class','area active');
	},
	filterByName: function(ev){
		var input, filter, trs, ths, th;
		input = document.getElementById("myInput");
		filter = input.value.toUpperCase();
		trs = document.getElementsByClassName("employees");
		console.log(trs);
		console.log(trs[0]);
		for (i = 0; i < trs.length; i++) {
		  ths = trs[i].getElementsByTagName("td");
		  if(ths[0] != null)
		    if (ths[0].innerText.toUpperCase().indexOf(filter) > -1) {
		        trs[i].style.display = "";
		    } else {
		        trs[i].style.display = "none";

		    }
		}
	}
});

var ProfilesList = Backbone.View.extend({
	el:"#bodySchedulerTableHere",
	render: function(){
		var that = this;
		var id;
		var areaActive = document.getElementsByClassName("area active");
		if(areaActive.length != 0){
			id = $(areaActive).attr('id');
			document.getElementById("tileTable").innerText= $(areaActive).attr('name');
	 		profileFilter.fetch({
		  		data: { 
		        	      id: id
	    	       	},
		      	processData: true,
		      	success: function(profileFilter){
	        		queryResult = profileFilter;
	        		var template = _.template($("#employees_template").html());
					that.$el.html(template({
						profiles: queryResult
					}));
		        	newrows();
	      		}
	  		});
	 	}
		
	}
});




//Routers    
var Router = Backbone.Router.extend({
  routes: {
    '':'home',
    'TRIPULANTE':'profile',
    'RAMPA':'profile',
    'TRAFICO':'profile',
    'MANTENIMIENTO':'profile',
    'COMERCIAL':'profile',
    'TOV':'profile',
    'SEGURIDAD':'profile',
    'TALENTO HUMANO':'profile',
    'JEFE DE AEREOPUERTO':'profile'
  }
});

//initializers

var areasMenu = new AreasList();
var profilesList = new ProfilesList();

var router = new Router();

var profileFilter = new ProfilesFilter();

//routs

router.on('route:home', function(){
  areasMenu.render();
});

router.on('route:profile', function(){
	profilesList.render();
});

Backbone.history.start();


//others functions

function sethead(date){
	var actDate = new Date();
	actDate.setDate(date.getDate());
	actDate.setMonth(date.getMonth());
	actDate.setFullYear(date.getFullYear());

	var head = document.getElementById("tableHead");
	var ths = head.getElementsByTagName("th");
	var lenThs = ths.length;
	for (i=1;i<lenThs;i++){
		head.removeChild(ths[1]);
	}

	var year = document.getElementById("year");
	year.innerText = mes(actDate.getMonth())+" "+String(actDate.getFullYear());

	var month = actDate.getMonth();
	while (actDate.getMonth()==month){
		var th = document.createElement("th");
		th.setAttribute("style","width: 35px")
		th.innerText = dia(actDate.getDay())+"\n"+String(actDate.getDate());
		head.appendChild(th);
		actDate.setDate(actDate.getDate()+1);
	}
}

function dia(dayNumber){
	if(dayNumber==0){
		return "D";
	}else if(dayNumber==1){
		return "L";
	}else if(dayNumber==2){
		return "M";
	}else if(dayNumber==3){
		return "Mi";
	}else if(dayNumber==4){
		return "J";
	}else if(dayNumber==5){
		return "V";
	}else if(dayNumber==6){
		return "S";
	}
	return "no valido";
}
function mes(monthNumber){
	if(monthNumber==0){
		return "Enero";
	}else if(monthNumber==1){
		return "Febrero";
	}else if(monthNumber==2){
		return "Marzo";
	}else if(monthNumber==3){
		return "Abril";
	}else if(monthNumber==4){
		return "Mayo";
	}else if(monthNumber==5){
		return "Junio";
	}else if(monthNumber==6){
		return "Julio";
	}else if(monthNumber==7){
		return "Agosto";
	}else if(monthNumber==8){
		return "Septiembre";
	}else if(monthNumber==9){
		return "Octubre";
	}else if(monthNumber==10){
		return "Noviembre";
	}else if(monthNumber==11){
		return "Diciembre";
	}

	return "no valido";
}

function newrows(){
	var head = document.getElementById("tableHead");
	var ths = head.getElementsByTagName("th");
	queryResult.each(function(profile){
		var tr = document.getElementById("tr"+String(profile.get('user').id));
		for (i=0;i<ths.length;i++){
		if(i>0){
			var td = document.createElement("td");
			td.setAttribute('style','font-size: 10px; width: 35px; vertical-align: inherit ');
			td.innerText = scheduler[Math.abs(parseInt((Math.random()*16)-1))];
			tr.appendChild(td);
		}	
	}
	});
	
}


$(document).ready(function(){
	
	sethead(maindate);

	$("#now").click(function(){
		maindate = new Date();
		maindate.setDate(maindate.getDate()+1-maindate.getDate());
		sethead(maindate);
		profilesList.render();
	});


	$("#lastWeek").click(function(){
		maindate.setMonth(maindate.getMonth()-1);
		sethead(maindate);
		profilesList.render();
	});
	$("#nextWeek").click(function(){
		maindate.setMonth(maindate.getMonth()+1);
		sethead(maindate);
		profilesList.render();
	});

});