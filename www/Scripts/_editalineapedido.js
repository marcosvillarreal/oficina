var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.editaLineaPedido = function () {

    var render = function () {

        var articuloId = preventamobile.ui.listaPedidos().obtenerIdArticuloSeleccionado();
        var lineaId = preventamobile.ui.listaPedidos().obtenerIdLineaSeleccionada();
        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();

        var pedido = preventamobile.dal().obtenerPedido(pedidoId);
        var articulo = preventamobile.dal().obtenerArticulo(articuloId);

        if (!articulo || !pedido) {
            alert("No se puede editar la linea especificada");
            return false;
        }

        var linea = preventamobile.dal().obtenerPedidoLinea(pedidoId, lineaId);

        // veo si es una linea nueva
        if (!linea) {
            linea = preventamobile.dal().factory().lineaPedido();
            linea.idarticulo = idarticulo;
            linea.codigoArticulo = articulo.numero;
            linea.cantidad = "";
            linea.bonif1 = articulo.bonif1;
            if (linea.bonif1 == 0) {
                linea.bonif1 = "";
            };
            linea.univenta = articulo.univenta;
            linea.unibulto = articulo.unibulto;
            if (linea.univenta == 0) {
                linea.univenta = "0";
            };

        } else {
            linea = pedido.lineas[lineaId];
        }

        var model = { linea: linea, articulo: articulo };
        $("#headerEditaLineaPedido").html($.templates("#headerEditaLineaPedidoTmpl").render(linea)).trigger('create');
        $("#editaLineaPedidoContent").html($.templates("#editaLineaPedidoContentTmpl").render(model)).trigger('create');
        $('#editaLineaSliderCambioVenta').val("off");
        return false;
    };

    var enviarAConfirmacionGuardarLinea = function (options, success, cancel) {

        // Cargar datos de detalle segun options {articulo}
        $('#articulo').val(options.articulo.numero + ' - ' + options.articulo.nombre);
        $('#articuloPrecioUnitario').val(options.articulo.preventa1);
        $('#articuloUnidadesPorBulto').val(options.articulo.unibulto);

        // Mostrar pantalla con detalles
        $.mobile.changePage("#confirmaAltaLineaPedidoPage");

        // Establecer slider luego de cambiar de pagina ya que tiene que estar inicializado para llamar al metodo refresh
        var sliderVal;
        if (options.articulo.univenta == '1') { sliderVal = 'on'; } else { sliderVal = 'off'; }
        $('#sliderUniVenta').val(sliderVal).slider("refresh");


        $("#cantidad").focus();

        $("#confirmaAltaLineaPedidoOk").unbind().click(success);
        $("#confirmaAltaLineaPedidoCancel").unbind().click(cancel);

    };

    var guardarLinea = function (edicion) {

        var articuloId = preventamobile.ui.listaPedidos().obtenerIdArticuloSeleccionado();
        var articulo = preventamobile.dal().obtenerArticulo(articuloId);

        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        var pedido = preventamobile.dal().obtenerPedido(pedidoId);

        var lineaId = preventamobile.ui.listaPedidos().obtenerIdLineaSeleccionada();
        var linea = preventamobile.dal().obtenerPedidoLinea(pedidoId, lineaId);

        // veo si es una linea nueva
        if (!linea) {
            linea = preventamobile.dal().factory().lineaPedido();
            linea.idarticulo = articuloId;
            linea.codigoArticulo = articulo.numero;
        } else {
            linea = pedido.lineas[lineaId];
        }

        // obtener valores de controles y actualizar info de la linea
        var uniVenta;
        var signo;

        if (edicion) {
            if ($('#editaLineaSliderCambioVenta').val() == "on") { signo = -1; } else { signo = 1; };
            linea.cantidad = Math.abs($('#editaLineaCantidad').val()) * signo;
            linea.bonif1 = $('#editaLineaBonif1').val();
            if ($('#editaLineaSliderUniVenta').val() == "on") { uniVenta = "1"; } else { uniVenta = "0"; };
            linea.univenta = uniVenta;
            linea.unibulto = $('#editaLineaUnibulto').val();
            // Actualizar la cantidad que varia segun el slider de cambio / venta
            $('#editaLineaCantidad').val(linea.cantidad);
        } else {
            if ($('#sliderVenta').val() == "on") { signo = -1; } else { signo = 1; };
            linea.cantidad = Math.abs($('#cantidad').val()) * signo;
            linea.bonif1 = $('#bonif1').val();
            if ($('#sliderUniVenta').val() == "on") { uniVenta = "1"; } else { uniVenta = "0"; };
            linea.univenta = uniVenta;
            linea.unibulto = $('#articuloUnidadesPorBulto').val();
        }

        linea.precio = articulo.preventa1;
        if (linea.cantidad == 0) {
            alert('Debe indicar una cantidad!');
            return false;
        };

        preventamobile.dal().guardarPedidoLinea(pedidoId, linea);
        return true;

    };

    var recalcularLineaEnEdicion = function () {

        var signo;
        if ($('#sliderVenta').val() == "on") { signo = -1; } else { signo = 1; };

        var cantidad = Math.abs($('#cantidad').val()) * signo;
        var bonif1 = $('#bonif1').val();
        var precio = $('#articuloPrecioUnitario').val();

        if ($('#sliderUniVenta').val() == "on") {
            cantidad = cantidad * $('#articuloUnidadesPorBulto').val();
        }

        var precioBonificado = (precio * (1 - (bonif1 / 100))).toFixed(3);
        $('#articuloPrecioBonificado').val(precioBonificado);
        $('#totalLinea').val((cantidad * precioBonificado).toFixed(3));

    };

    var lineaNueva = function () {
        $.mobile.changePage('#altaLineaPedidoPage');

    };

    var borrarLinea = function () {

        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        var lineaId = preventamobile.ui.listaPedidos().obtenerIdLineaSeleccionada();

        if (!pedidoId) {
            alert('Debe seleccionar la linea a borrar');
        } else {

            preventamobile.dal().eliminarPedidoLinea(pedidoId, lineaId);

            $.mobile.changePage('#listaArticulosPedidoPage');
        }

    };

    var inicializarLinea = function () {

        // Nueva linea siempre se muestra como venta
        $('#sliderVenta').val('off').slider("refresh");
        $("#artbus").val("");
        $("#artbus2").val("");
        $("#cantidad").val("");
        $("#bonif1").val("");
        $("#resultados").empty();

    };


    return {
        render: render,
        lineaNueva: lineaNueva,
        guardarLinea: guardarLinea,
        enviarAConfirmacionGuardarLinea: enviarAConfirmacionGuardarLinea,
        inicializarLinea: inicializarLinea,
        borrarLinea: borrarLinea,
        recalcularLineaEnEdicion: recalcularLineaEnEdicion
    };
};

//@ sourceURL=_editalineapedido.js