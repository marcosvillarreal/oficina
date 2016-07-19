var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.sync = function () {

    var sincronizar,
        renderServidor,
        render,
        create,
        tipoSync,
        renderLog,
        ingresarLog;

    create = function () {
        $("#syncButton").click(function () {
            $.mobile.changePage("#sincronizandoPage", { changeHash: false });
        });
        $("#syncClientesButton").click(function () {
            alert("sync clientes");
           // $.mobile.changePage("#sincronizandoPage", { changeHash: false });
        });

    };

    render = function () {
        var sList = $("#ulSync");
        sList.empty();
        var divdia = $("#divDia");        
        var op = localStorage.getItem("opcionSync");
        var tipoSync = ["Clientes/Precios", "Pedidos", "Total"];
        $('#syncPage').attr("data-title", "Sync " + tipoSync[op - 1]);

        try {
            preventamobile.dal().serverInfo(function (data) {
                // TODO: verificar si tengo conexion, sino mostrar un mensaje de error y direccionar a pagina inicial
            });
        } catch (e) {
            // TODO: error al acceder al servidor informar y direccionar a pagina inicial
        }
                
        // TODO: solo realizar si tengo acceso al servidor

        if (op == 1 || op == 3) {
            divdia.show();
            var menudia = $("#diaSelect");
            var d = new Date();
            var n = d.getDay();
            menudia[0].selectedIndex = n;            
            menudia.selectmenu("refresh");
        } else {
            divdia.hide();
            
        };
        renderServidor();
    };

    ingresarLog = function () {
        var ans = prompt("Ingrese la clave de administrador");

        if (ans !== "gg") {
            $.mobile.changePage("#homePage");
            alert('Clave incorrecta');
        } else {

            $.mobile.changePage("#logPage");
        }
    };

    tipoSync = function (op)   {
        localStorage.setItem("opcionSync", op);
        //1 clientes - 2- pedidos 3- todo
      $.mobile.changePage("#syncPage");

    };

    renderLog = function () {
        var logActual = preventamobile.dal().obtenerLog();
        var htmlLog = "N/D";

        if (logActual && logActual.length > 0) {
            var lineasLog = logActual.split('|');
            htmlLog = "<ul data-theme='a' data-role='listview' data-inset='true' data-autodividers='false'>";

            for (var i = 0; i < lineasLog.length; i++) {
                htmlLog = htmlLog + "<li>" + lineasLog[i] + "</li>";
            }

            htmlLog = htmlLog + "</ul>";
        }

        $("#logContent").html(htmlLog).trigger('create');
    };

    renderServidor = function () {
        var selectedServer = preventamobile.configuration().getUrlBase();
        var html = "<label for='direccionServidorSelect'><h3>Servidor</h3></label><select id='direccionServidorSelect' name='direccionServidorSelect' data-theme='a' data-icon='arrow-d' data-native-menu='false'>";
        var options = preventamobile.configuration().getUrlServerOptions();
        for (var i = 0; i < options.length; i++) {
            html = html + "<option value='" + options[i] + "'";
            if (options[i] == selectedServer)
                html = html + " selected ";
            html = html + ">" + options[i] + "</option>";
        }

        html = html + "</select>";

        var loginInfo = preventamobile.dal().getLoginInfo();
        if (loginInfo && loginInfo.username && loginInfo.password) {
            $("#usernameTextBox").val(loginInfo.username);
            $("#claveTextBox").val(loginInfo.password);
        }

        $("#direccionServidorContent").html(html).trigger('create');
    };

    sincronizar = function () {

        var urlServidor = $("#direccionServidorSelect").val();

        preventamobile.configuration().setUrlBase(urlServidor);

        var username = $("#usernameTextBox").val();
        var clave = $("#claveTextBox").val();

        var menudia = $("#diaSelect");
        var dia = menudia[0].value;
        $("#syncP").text("");
        var filtro = { dia: dia, username: username, clave: clave };

        var error = preventamobile.dal().sync({ progreso: "#syncP", filtro: filtro });
        var op = localStorage.getItem("opcionSync");
        var tipoSync = ["Clientes/Precios", "Pedidos", "Total"];
        var mensaje = "<h1>Sync "+ tipoSync[op - 1] + " finalizado</h1>";
        

        if (error === "") {
            preventamobile.util().showDialog(mensaje);
        } else {
            preventamobile.util().showDialog("<h1>Error al hacer el sync</h1>" + error);
        }

    };

    return {
        create: create,
        sincronizar: sincronizar,
        render: render,
        renderLog: renderLog,
        tipoSync: tipoSync,
        ingresarLog: ingresarLog
    };
};

//@ sourceURL=_sync.js