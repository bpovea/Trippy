//namespace for our app

var app = {};
var siteRoot = 'http://localhost:8000'


//Modelos   
//var Cliente = Backbone.Model.extend();

//colecciones
var Clientes = Backbone.Collection.extend({
  url: siteRoot+'/clientes/'
});

var Asignaciones = Backbone.Collection.extend({
  url: siteRoot+'/asignaciones/'
});

var Solicitudes = Backbone.Collection.extend({
  url: siteRoot+'/solicitudes/'
});


//Vistas
var ClienteList = Backbone.View.extend({
  el: '#tripAsigment-board-here',
  render: function () {
    //this.$el.html('contenido');
    
    var that = this;
    var asignaciones = new Asignaciones();
    var solicitudes = new Solicitudes();
    
    asignaciones.fetch({
      success: function(asignaciones){

        solicitudes.fetch({
          success: function(solicitudes){
            var template = _.template($('#tripAsigment-template').html());
            that.$el.html(template({asignaciones : asignaciones.models, solicitudes : solicitudes.models}));
          }
        });
      }
    })
  },
  events: {
    //'dragover .column-items' : 'saveClient',//mejor no usar jeje....
    'drop .column-items' : 'saveClient',//al insertarse en el area
    //'dragleave .column-items' : 'saveClient',//deja el area
    //'dragenter .column-items' : 'saveClient',//entra al area
  },
  saveClient: function(ev){
    console.log(ev);
    console.log($(ev.currentTarget));//padre de elemento
    console.log($(ev.currentTarget.lastElementChild).attr('name'));//atributo name de elemento agregado
    console.log($(ev.currentTarget.lastElementChild).attr('id_cliente'))
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

var clienteList = new ClienteList();

var router = new Router();
router.on('route:home', function(){
  //console.log('Cargando home page');
  clienteList.render();
});

//draggable

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log(data);//id elemento a transferir
    console.log(ev.target);//target del lugar de destino
    console.log(document.getElementById(data));//target de elemeto a tranferir
    ev.target.appendChild(document.getElementById(data));
}

Backbone.history.start();
