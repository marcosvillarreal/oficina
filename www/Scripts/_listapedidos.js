var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.listaPedidos = function () {

    var render,
        aplicarPedido,
        borrarPedido,
        pedidoNuevo,
        pedidoSeleccionado,
        renderPedidosDetalle,
        informarPedidoSyncOk,
        informarPedidoSyncError,
        establecerIdPedidoSeleccionado,
        obtenerIdPedidoSeleccionado,
        hayPedidoSeleccionado,
        establecerIdClienteSeleccionado,
        obtenerIdClienteSeleccionado,
        hayClienteSeleccionado,
        establecerIdArticuloSeleccionado,
        obtenerIdArticuloSeleccionado,
        hayArticuloSeleccionado,
        establecerIdLineaSeleccionada,
        obtenerIdLineaSeleccionada,
        hayLineaSeleccionada,
        limpiarLineaSeleccionada;

    renderPedidosDetalle = function () {

        var pedido;

        if (!hayPedidoSeleccionado()) {
            var codigoCliente = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
            pedido = preventamobile.dal().factory().pedido(codigoCliente);
        }
        else {
            var indicePedido = obtenerIdPedidoSeleccionado();
            pedido = preventamobile.dal().obtenerPedido(indicePedido);
        }

        var htmlHeader = $.templates("#headerEditaPedidosTmpl").render(pedido);
        $("#headerEditaPedidos").html(htmlHeader).trigger('create');

        // El input de tipo date necesita la fecha en formato YYYY-MM-DD por lo que se agrega una funcion helper que utiliza jsrender
        var htmlContent = $.templates("#editaPedidoContentTmpl").render(pedido,
            {
                toDate: function (fecha) {
                    var dateToReturn = moment(fecha, 'DD/MM/YYYY').format('YYYY-MM-DD');
                    return dateToReturn;
                }
            });
        $("#editaPedidosContent").html(htmlContent).trigger('create');

    };

    //#region Info sobre cliente activo

    establecerIdClienteSeleccionado = function (id) {
        localStorage.setItem("CurrentClienteId", id);
    };

    obtenerIdClienteSeleccionado = function () {
        var clienteId = localStorage.getItem("CurrentClienteId");
        if (clienteId) {
            clienteId = clienteId.trim();
        }
        return clienteId;
    };

    hayClienteSeleccionado = function () {
        var currentId = localStorage.getItem("CurrentClienteId");
        return currentId != undefined && currentId != 0;
    };

    //#endregion

    //#region Info sobre articulo activo

    establecerIdArticuloSeleccionado = function (id) {
        localStorage.setItem("CurrentArticuloId", id);
    };

    obtenerIdArticuloSeleccionado = function () {
        return localStorage.getItem("CurrentArticuloId").trim();
    };

    hayArticuloSeleccionado = function () {
        var currentId = localStorage.getItem("CurrentArticuloId");
        return currentId != undefined && currentId != 0;
    };

    //#endregion

    //#region Info sobre pedido activa

    establecerIdPedidoSeleccionado = function (id) {
        localStorage.setItem("CurrentPedidoId", id);
    };

    obtenerIdPedidoSeleccionado = function () {
        return localStorage.getItem("CurrentPedidoId").trim();
    };

    hayPedidoSeleccionado = function () {
        var currentId = localStorage.getItem("CurrentPedidoId");
        return currentId != undefined && currentId != 0;
    };

    //#endregion

    //#region Info sobre linea activa

    establecerIdLineaSeleccionada = function (id) {
        localStorage.setItem("CurrentLineaId", id);
    };

    obtenerIdLineaSeleccionada = function () {
        return localStorage.getItem("CurrentLineaId").trim();
    };

    hayLineaSeleccionada = function () {
        var currentId = localStorage.getItem("CurrentLineaId");
        return currentId != undefined;
    };

    limpiarLineaSeleccionada = function () {
        establecerIdLineaSeleccionada(undefined);
    };

    //#endregion

    render = function () {

        var listaPedidos,
            tipoDePedido,
            html;

        var codigoCliente = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
        listaPedidos = preventamobile.dal().listarPedidos(codigoCliente);
        // Si no hay pedidos los mando directo a NUEVO
        if (listaPedidos.length == 0) {
            preventamobile.ui.listaPedidos().pedidoNuevo();
        }
        else {

            html = "<div data-role='navbar'><ul id='listapednav'><li><a href='#homePage' data-icon='home' data-iconpos='notext'>Inicio</a></li><li><a href='#clientesDetallePage' data-icon='back'>Atrás</a>" +
            "</li><li><a href='#' data-icon='plus'onclick='preventamobile.ui.listaPedidos().pedidoNuevo();'>Nuevo</a></li></ul></div>";
            $("#headerlistaPedidos").html(html).trigger('create');
            html = "<div data-role='fieldcontain' class='ui-hidden-accessible'><label id='xcodigopedido'>" + "0" + "</label>" + "</div>";
            html = html + "<ul id='ullistaped' data-theme='a' data-role='listview' data-inset='true' data-autodividers='false' " +
            "data-filter='true' data-filter-placeholder='Ingrese valor a buscar'> ";


            $.each(listaPedidos, function (index, value) {
                tipoDePedido = preventamobile.dal().obtenerTipoPedido(value.tipoDePedido);
                html = html + "<li  style='white-space:normal;' data-theme='a' ><a style='white-space:normal;' href='#' onclick='preventamobile.ui.listaPedidos().pedidoSeleccionado(" +
                '"' + value.pedidoId + '"' + ");' ><br><h1>" + value.fecha + " " + tipoDePedido.Descripcion + " - $" + value.total + "</h1></a><br></li>";
            });
            html = html + "</ul>";

            $("#listaPedidosContent").html(html).trigger('create');
        }
    };

    pedidoNuevo = function () {
        establecerIdPedidoSeleccionado(0);
        $.mobile.changePage('#editaPedidosPage');
    };

    pedidoSeleccionado = function (codigo) {
        establecerIdPedidoSeleccionado(codigo);
        $.mobile.changePage('#editaPedidosPage');
    };

    /// Este metodo para pedidos nuevos genera un nuevo pedido desde la factory, ya que hasta que no es guardado por primera vez
    ///     no se encuentra realmente en el localStorage
    aplicarPedido = function (redirigir) {

        // redirigir=3, sync individual
        // redirigir>2, no redirige
        // redirigir=1, esta aplicando desde la pagina de detalle
        // redirigir=0, guardo el pedido automaticamente cuando paso a articulos

        var pedidoId = $('#pedidoId').text();
        var pedido = preventamobile.dal().obtenerPedido(pedidoId);

        var tipoDePedido, tP;

        tP = $('input[name="radio-choice-1"]:checked').val();

        tipoDePedido = tP;

        var remito = $('input[name="radio-remito"]:checked').val();

        var vales;
        if ($('#sliderVales').val() == "on") {
            vales = "1";
        } else {
            vales = "0";
        }

        var bonificaciones;
//        if ($('#sliderBoni').val() == "on") {
//            bonificaciones = "1";
//        } else {
            bonificaciones = "0";
//        }

        var observaciones = $('#textObserva').val();
        // Utiliza momentjs para formatear la fecha que se va a guardar en el objeto con formato dd/mm/yyyy
        var fechaEntrega = moment($('#date2').val()).format("DD/MM/YYYY");

        pedido.tipoDePedido = tipoDePedido;
        pedido.vales = vales;
        pedido.remito = remito;
        pedido.bonificaciones = bonificaciones;
        pedido.observaciones = observaciones;
        pedido.fechaEntrega = fechaEntrega;

        preventamobile.dal().guardarPedido(pedido);

        // Cambio el tema x el de venta
        var idlineacliente;
        idlineacliente = "#lcli" + pedido.codigoCliente.trim();
        $(idlineacliente).attr("data-theme", "b").trigger('mouseover');
        $(idlineacliente).removeClass('ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e')
                   .addClass('ui-btn-up-' + "b")
                   .attr('data-theme', "b");


        // guardo el codigo del pedido nuevamente por si era uno nuevo y no tenia numero
        establecerIdPedidoSeleccionado(pedido.pedidoId);

        switch (redirigir) {
            case 0:
                $.mobile.changePage('#listaArticulosPedidoPage');
                break;
            case 1:
                $.mobile.changePage('#listaPedidosPage');
                break;
            case 2:
                //preventamobile.ui.gridCargaRapidaArticulo().lanzarLista();
                break;
            case 3:

                var r = confirm("Desea sincronizar el pedido?");
                if (r == true) {
                    var lista = [];
                    lista[0] = pedido;

                    var noventa = [];

                    var model = { data: preventamobile.util().serializar(preventamobile.util().comprimir(lista)), noventa: preventamobile.util().serializar(noventa), login: preventamobile.util().serializar(preventamobile.dal().getLoginInfo()) };
                    preventamobile.dal().syncPedidosConServidor(model, informarPedidoSyncOk, informarPedidoSyncError);


                } else {
                    alert("No se sincronizó el pedido");
                }

                break;
        };
    };





    informarPedidoSyncOk = function () {
        preventamobile.util().showDialog('<h2>Pedido sincronizado</h2>', function () { $.mobile.changePage('#listaPedidosPage'); });
    };

    informarPedidoSyncError = function (error) {
        preventamobile.util().showDialog('<h2>Error al hacer sync del pedido ' + error + '<h2>', function () { $.mobile.changePage('#listaPedidosPage'); });
    };

    borrarPedido = function () {

        var pedido;
        pedido = $('#indicepedido').text();

        if (pedido == 0) {
            alert('Debe seleccionar el pedido a borrar');
        } else {
            preventamobile.dal().eliminarPedido(pedido);
            $.mobile.changePage('#listaPedidosPage');
        }

    };

    return {
        render: render,
        pedidoNuevo: pedidoNuevo,
        pedidoSeleccionado: pedidoSeleccionado,
        aplicarPedido: aplicarPedido,
        renderPedidosDetalle: renderPedidosDetalle,
        borrarPedido: borrarPedido,
        establecerIdPedidoSeleccionado: establecerIdPedidoSeleccionado,
        obtenerIdPedidoSeleccionado: obtenerIdPedidoSeleccionado,
        hayPedidoSeleccionado: hayPedidoSeleccionado,
        establecerIdClienteSeleccionado: establecerIdClienteSeleccionado,
        obtenerIdClienteSeleccionado: obtenerIdClienteSeleccionado,
        hayClienteSeleccionado: hayClienteSeleccionado,
        establecerIdArticuloSeleccionado: establecerIdArticuloSeleccionado,
        obtenerIdArticuloSeleccionado: obtenerIdArticuloSeleccionado,
        hayArticuloSeleccionado: hayArticuloSeleccionado,
        establecerIdLineaSeleccionada: establecerIdLineaSeleccionada,
        obtenerIdLineaSeleccionada: obtenerIdLineaSeleccionada,
        hayLineaSeleccionada: hayLineaSeleccionada,
        limpiarLineaSeleccionada: limpiarLineaSeleccionada
    };
};

//@ sourceURL=_listapedidos.js