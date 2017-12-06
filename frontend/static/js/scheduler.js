var maindate = new Date();
var maindateTemp = new Date();

function setdia(date1,date1Temp){
	var year = document.getElementById("year");
	year.innerText = mes(date1.getMonth())+" "+String(date1.getFullYear());
	var date = new Date();
	var dateTemp = new Date();
	date.setDate(date1.getDate());
	dateTemp.setDate(date1Temp.getDate());
	date.setMonth(date1.getMonth());
	dateTemp.setMonth(date1Temp.getMonth());
	date.setFullYear(date1.getFullYear());
	dateTemp.setFullYear(date1Temp.getFullYear());
	var head = document.getElementById("tableHead");
	while (date.getDay()!=0){
		var th = document.getElementById(String(date.getDay()));
		th.innerText = dia(date.getDay())+"\n"+mes(date.getMonth())+" "+String(date.getDate());
		date.setDate(date.getDate()-1);
	}
	while (dateTemp.getDay()!=1){
		var th = document.getElementById(String(dateTemp.getDay()));
		th.innerText = dia(dateTemp.getDay())+"\n"+mes(dateTemp.getMonth())+" "+String(dateTemp.getDate());
		dateTemp.setDate(dateTemp.getDate()+1);
	}
}

function dia(dayNumber){
	if(dayNumber==0){
		return "Domingo";
	}else if(dayNumber==1){
		return "Lunes";
	}else if(dayNumber==2){
		return "Martes";
	}else if(dayNumber==3){
		return "Miércoles";
	}else if(dayNumber==4){
		return "Jueves";
	}else if(dayNumber==5){
		return "Viernes";
	}else if(dayNumber==6){
		return "Sábado";
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

$(document).ready(function(){
	//inicializa el día en la semana actual
	setdia(maindate, maindateTemp);

	$("#newRow").click(function(){
		var tr = document.createElement("tr");
		for (i=0;i<8;i++){
			var td = document.createElement("td");
			tr.appendChild(td);
		}
		var bodyTable = document.getElementById("bodySchedulerTable");
		bodyTable.appendChild(tr);
	});


	$("#lastWeek").click(function(){
		maindate.setDate(maindate.getDate()-7);
		maindateTemp.setDate(maindateTemp.getDate()-7);
		setdia(maindate,maindateTemp);
	});
	$("#nextWeek").click(function(){
		maindate.setDate(maindate.getDate()+7);
		maindateTemp.setDate(maindateTemp.getDate()+7);
		setdia(maindate,maindateTemp);
	});

});