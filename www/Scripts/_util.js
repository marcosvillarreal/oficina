var preventamobile = preventamobile || {};

preventamobile.util = function () {

    var showDialog,
        log,
        verlog,
        lanzaralertas = false,
        setLanzarAlertas,
        setAuthorizationHeader,
        sleep,
        strZ,
        exitFromApp,
        abrirPaginaPrecios,
        generateUUID,
        serializar,
        comprimir;

    strZ = function (x) {
        if (x < 10) {
            x = "0" + x;
        };
        return x;
    };
    

    serializar = function (objetoASerializar) {
        var    objetoSerializado = JSON.stringify(objetoASerializar);
        return objetoSerializado;
    };

    comprimir = function(objetoAComprimir) {
        var hbest = JSON.hbest(objetoAComprimir);
        var objetoComprimido = JSON.hpack(objetoAComprimir, hbest);
        return objetoComprimido;
    }

    setLanzarAlertas = function (value) {
        lanzaralertas = value;
    };

    generateUUID = function () {
        // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
        // Testing propio generando gran cantidad de uuid en: http://jsfiddle.net/4n5ba5m6/8
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    setAuthorizationHeader = function (xhr, options) {
        try {
            log("estableciendo header de autorizacion: " + options.username);
            xhr.setRequestHeader("Authorization", "Basic " + $.base64.btoa(options.username + ":" + options.password));
        } catch (e) {
            log("error al establecer header de autorizacion: " + e);
        }

    };

    abrirPaginaPrecios = function () {
        if (preventamobile.dal().articulosLista().length > 0) {
            $.mobile.changePage("#preciosPage");
        } else {
            showDialog("<h2>No hay información de artículos para mostrar</h2>", function () { $.mobile.changePage("#homePage"); });
        }
    };

    showDialog = function (content, callback) {

        if (callback) {
            log("showCallbackDialog: " + content);
            $("#messageCallbackContent").html(content);
            $("#dialogCallbackContinuarButton").click(callback);
            $.mobile.changePage("#dialogCallbackPage", { changeHash: false });
        } else {
            log("showDialog: " + content);
            $("#messageContent").html(content);
            $.mobile.changePage("#dialogPage", { changeHash: false });
        }

    };

    log = function (mensaje) {
        $("#syncP").text("");
        preventamobile.dal().agregarLog(mensaje);

        if (lanzaralertas) {
            alert(mensaje);
        } else {
            if (window && window.console) {
                window.console.log(mensaje);
            }
        }

        if (preventamobile.parametros.indicadorProgreso && preventamobile.parametros.indicadorProgreso.length > 0) {
            $(preventamobile.parametros.indicadorProgreso).text(mensaje);
            $(preventamobile.parametros.indicadorProgreso).trigger('refresh');

        }

    };


    verlog = function (mensaje) {

        var sList = $("#ulSync");
        var nuevalinea = "<li style='white-space:normal' >" + "<a style='white-space:normal' href='#' >" + mensaje + "</a></li>";
        sList.append(nuevalinea);
        sList.listview("refresh");

    };


    sleep = function (milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    };
    
    exitFromApp = function () {

        if (navigator && navigator.app && navigator.app.exitApp) {
            navigator.app.exitApp();
        } else {
            preventamobile.util().showDialog("No se puede cerrar la app en este dispositivo", function () { $.mobile.changePage("#homePage"); });
        }

    };

    return {
        showDialog: showDialog,
        log: log,
        verlog: verlog,
        setLanzarAlertas: setLanzarAlertas,
        setAuthorizationHeader: setAuthorizationHeader,
        sleep: sleep,
        strZ: strZ,
        exitFromApp: exitFromApp,
        abrirPaginaPrecios: abrirPaginaPrecios,
        generateUUID: generateUUID,
        serializar: serializar,
        comprimir: comprimir
    };
};

String.prototype.toProperCase = function () {
    return this.toLowerCase().replace(/^(.)|\s(.)/g,
        function ($1) { return $1.toUpperCase(); });
};

//@ sourceURL=_util.js