var maindate = new Date();
maindate.setDate(maindate.getDate()+1-maindate.getDate());
//var maindateTemp = new Date();

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

$(document).ready(function(){
	
	sethead(maindate);

	$("#newRow").click(function(){
		console.log("here");
		var head = document.getElementById("tableHead");
		var ths = head.getElementsByTagName("th");
		var tr = document.createElement("tr");
		for (i=0;i<ths.length;i++){
			console.log("hoalalalala");
			var td = document.createElement("td");
			tr.appendChild(td);
		}
		var bodyTable = document.getElementById("bodySchedulerTable");
		bodyTable.appendChild(tr);
	});


	$("#lastWeek").click(function(){
		maindate.setMonth(maindate.getMonth()-1);
		sethead(maindate);
	});
	$("#nextWeek").click(function(){
		maindate.setMonth(maindate.getMonth()+1);
		sethead(maindate);
	});

});