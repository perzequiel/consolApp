//var URL_GLOBAL = 'http://localhost:8080/paginas/sheepyweb/site/rest/Api.php?url=';
var URL_GLOBAL = 'http://www.sheepyweb.com/site/rest/Api.php?url=';

angular.module('ConsolApp', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {

      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('ingreso',{
        url: "/ingreso",
        templateUrl:"vistas/login.html",
        controller: "loginController"
    })
    .state('formulario',{
        url: "/formulario",
        templateUrl:"vistas/formulario.html",
        controller: "miembrosController"
    })
    .state('respuesta',{
        url: "/respuesta",
        templateUrl:"vistas/respuesta.html"
    });

    $urlRouterProvider.otherwise('/ingreso');
})

.controller('loginController', function($scope, $http, $ionicPopup, userPassSesion) {

    $scope.validarLogin = function(user,pass) {

        if (user==undefined || user=="") {
            alert('El Usuario no puede estar en blanco');
        }
        else {
            if (pass==undefined || pass=="") {
                alert('la Clave no puede estar en blanco');
            }
            else {
                msg = { user : user, pass : pass};
                
                $http.get(URL_GLOBAL+'/SrvAdministracion/ValidarLogin/'+user+'/'+pass)
                .then(function (res) {
                    if (res.data.response=="ok"){
                        userPassSesion.setUser(user);
                        userPassSesion.setPass(pass);

                        var myPopup = $ionicPopup.show({
                            template: '<p>Ingrese los miembros a consolidar</p>',
                            title: 'Sheepyweb',
                            subTitle: 'Bienvenido '+userPassSesion.getUser(),
                            scope: $scope,
                            buttons: [{ text: 'Cerrar' }]
                        });
                        myPopup.then(function(res) {
                            console.log('Respuesta', res);
                        });
                        
                        window.location.href = "#/formulario";
                        
                    }
                    else {

                        var myPopup = $ionicPopup.show({
                            template: '<p>mensaje : '+res.data.message+'</p>',
                            title: 'Sheepyweb',
                            subTitle: 'El Servicio de Acceso dice: ',
                            scope: $scope,
                            buttons: [{ text: 'Cancel' }]
                        });
                        myPopup.then(function(res) {
                            console.log('Respuesta', res);
                        });

                        //alert(res.data.message);
                    }
                });
            }
        }
    };
})

.controller('miembrosController', function($scope, $http, $ionicPopup, userPassSesion) {

    $scope.edad = { anios : 0};

    $scope.aux = {
        genero_val : [],
        estado_civil : [],
        hijos : '',
        viene_por : '',
        desea_ser_llamado : '',
        tipo_tel : '',
        compania_tel : '',
        provincia_dir : ''
    };

    $scope.nuevo = {
        persona : {

            nombre : '',
            apellido : '',
            fecha_nacimiento : '',
            genero : '',
            estado_civil : '',
            estado_miembro : 'CONSOLIDADO '
        },
        consolidacion : {
            hijos : '',
            viene_por : '',
            desea_ser_llamado : '',
            motivo_oracion : ''
        },
        telefono : {

            tipo : '',
            compania : '',
            numero : '',
            observcion : ''
        },
        ubicacion : {

            pais : 'ARGENTINA',
            provincia : '',
            localidad : '',
            direccion : '',
            codigo_postal : 0000
        }
    };

    $scope.inicializar = function(value) {

        $scope.edad = { anios : 0};

        $scope.aux.genero_val = [];
        $scope.aux.estado_civil = [];
        $scope.aux.hijos = '';
        $scope.aux.viene_por = '';
        $scope.aux.desea_ser_llamado = '';
        $scope.aux.tipo_tel = '';
        $scope.aux.compania_tel = '';
        $scope.aux.provincia_dir = '';    

        $scope.nuevo.persona.nombre='';
        $scope.nuevo.persona.apellido='';
        $scope.nuevo.persona.fecha_nacimiento='';
        $scope.nuevo.persona.genero='';
        $scope.nuevo.persona.estado_civil='';

        $scope.nuevo.consolidacion.hijos='';
        $scope.nuevo.consolidacion.viene_por='';
        $scope.nuevo.consolidacion.desea_ser_llamado='';
        $scope.nuevo.consolidacion.motivo_oracion='';

        $scope.nuevo.telefono.tipo='';
        $scope.nuevo.telefono.compania='';
        $scope.nuevo.telefono.numero='';
        $scope.nuevo.telefono.observcion='';

        $scope.nuevo.ubicacion.provincia='';
        $scope.nuevo.ubicacion.localidad='';
        $scope.nuevo.ubicacion.direccion='';

        $scope.genero = $scope.generarCombo('TIPOGENERO');
        $scope.estadoCivil = $scope.generarCombo('ESTADOCIVIL');
        $scope.provincia = $scope.generarCombo('DIRPROVINCIA');
        $scope.localidad = $scope.generarCombo('DIRLOCALIDAD');
        $scope.tipoTelefono = $scope.generarCombo('TIPOTELEFONO');
        $scope.companiaTelefono = $scope.generarCombo('TIPOTELCOMPANIA');
    }

    $scope.setValueSearch = function(value) {
        document.getElementById('searchValue').value=value;
    }

    $scope.generarCombo = function(concepto) {

        var combo = [];

        msg = { user : userPassSesion.getUser(), pass : userPassSesion.getPass(), msg : { concepto : concepto } };
    
        $http.post(URL_GLOBAL+'/SrvAdministracion/getParametros', msg)
        .then(function (res) {
            if (res.data.list!=undefined){
              for (var i = 0; i < res.data.list.length; i++) {
                  combo.push({'id': i, 'nombre': res.data.list[i].VAL_VALOR })
              }
            }
        });
    
        return combo;
    };
  
    $scope.guardarConsolidacion = function() {
        
        var fecha = new Date();
        var anio_nacimiento = fecha.getFullYear()-$scope.edad.anios;
        
        $scope.nuevo.persona.fecha_nacimiento = anio_nacimiento+'-01-01';

        $scope.nuevo.persona.genero = $scope.aux.genero_val.nombre!=undefined?$scope.aux.genero_val.nombre:'';
        $scope.nuevo.persona.estado_civil = $scope.aux.estado_civil.nombre!=undefined?$scope.aux.estado_civil.nombre:'';
        $scope.nuevo.consolidacion.hijos = ($scope.aux.hijos=='Si');
        $scope.nuevo.consolidacion.viene_por = $scope.aux.viene_por!=undefined?$scope.aux.viene_por:'';
        $scope.nuevo.consolidacion.desea_ser_llamado = ($scope.aux.desea_ser_llamado=='Si');

        $scope.nuevo.telefono.tipo = $scope.aux.tipo_tel.nombre!=undefined?$scope.aux.tipo_tel.nombre:'';
        $scope.nuevo.telefono.compania = $scope.aux.compania_tel.nombre!=undefined?$scope.aux.compania_tel.nombre:'';
        $scope.nuevo.ubicacion.provincia = $scope.aux.provincia_dir.nombre!=undefined?$scope.aux.provincia_dir.nombre:'';

        $scope.nuevo.ubicacion.localidad = document.getElementById('searchValue').value;

        msg = { user : userPassSesion.getUser(), pass : userPassSesion.getPass(), msg : $scope.nuevo };
    
        $http.post(URL_GLOBAL+'/SrvMiembros/guardarConsolidacion', msg)
        .then(function (res) {
            console.log(res);

            var myPopup = $ionicPopup.show({
                template: '<p>'+res.response+'</p>',
                title: 'Sheepyweb',
                subTitle: 'Servicio de Miembros dice: ',
                scope: $scope,
                buttons: [{ text: 'Cerrar' }]
            });
            myPopup.then(function(res) {
                console.log('Respuesta', res);
            });

            window.location.href = "#/respuesta";

        });
    };

    $scope.inicializar();
})

.service('userPassSesion', function () {
    var user = '';
    var pass = '';

    return {
        getUser: function () {
            return user;
        },
        setUser: function(value) {
            user = value;
        },
        getPass: function () {
            return pass;
        },
        setPass: function(value) {
            pass = value;
        }
    };
});