$(document).ready(function () {
    document.addEventListener("deviceready",
        function() {
            // http://stackoverflow.com/questions/32443328/how-do-i-keep-my-cordova-app-full-screen-when-opening-the-android-keyboard
            // https://github.com/mesmotronic/cordova-plugin-fullscreen
            AndroidFullScreen.immersiveMode();
        },
        false);
});

$(document).on("pageinit", "#homePage", function () {

    var attachFastClick = Origami.fastclick;
    attachFastClick(document.body);

    preventamobile.dal().setTitle();

    $.mobile.defaultPageTransition = "none";

    $(document).ajaxStart(function () {
        $.mobile.loading('show');
    });

    $(document).ajaxStop(function () {
        $.mobile.loading('hide');
    });

    $(document).on('pagecreate', "#syncPage", preventamobile.ui.sync().create);

    $(document).on('pageshow', "#syncPage", preventamobile.ui.sync().render);

    $(document).on('pageshow', "#logPage", preventamobile.ui.sync().renderLog);

    $(document).on('pageshow', "#sincronizandoPage", preventamobile.ui.sync().sincronizar);

    $(document).on('pagecreate', "#noventaPage", preventamobile.ui.noVenta().render);

    // TODO: Usar el pagecreate provoca que no se actualice la informacion de tiene pedido cuando se crean pedidos de prueba Issue #37 e Issue #35
    // Al usar el pagecreate los datos se cargan una sola vez, por lo que tendriamos que buscar al hacer el guardarpedido si la pagina ya existe y modificar el html para que quede como que el cliente tiene pedido (iria en el establecer de que tiene pedido)
    // tambien hay que tener en cuenta si se eliminan pedidos que hay que desmarcar el cliente
    // La performance de la carga de clientes (que normalmente no serian tantos ya que son solo los del dia) justifica estas modificaciones?
    $(document).on('pageshow', "#clientesPage", preventamobile.ui.cliente().render);

    $(document).on('pageshow', "#clientesFueraRutaPage", preventamobile.ui.cliente().renderFueraRuta);

    // Como el create no se puede lanzar dentro del sync se lanza cada vez que se va a mostrar el page (el html ya esta cargado)
    $(document).on('pageshow', "#preciosPage", function () {
        if (!$("#divprecios").html()) {
            preventamobile.ui.precios().render(false);
            $("#preciosContent").trigger('create');
        }

    });

    $(document).on('pageshow', "#listaPedidosPage", preventamobile.ui.listaPedidos().render);

    $(document).on('pageshow', "#listaArticulosPedidoPage", preventamobile.ui.listaArticulosPedido().render);

    $(document).on('pageshow', "#preciosDetallePage", preventamobile.ui.precios().renderPreciosDetalle);

    $(document).on('pageshow', "#clientesDetallePage", preventamobile.ui.cliente().renderClientesDetalle);

    $(document).on('pageshow', "#infoPedidosPage", preventamobile.ui.cliente().renderinfoPedidosPage);

    $(document).on('pageshow', "#editaPedidosPage", preventamobile.ui.listaPedidos().renderPedidosDetalle);

    $(document).on('pageshow', "#editaLineaPedidoPage", preventamobile.ui.editaLineaPedido().render);

    $(document).on('pageshow', "#editaLineaVariedadesPage", preventamobile.ui.editaLineaVariedades().render);

    $(document).on('pageshow', "#altaLineaPedidoPage", preventamobile.ui.altaLineaPedido().render);

    $(document).on("click", "#buscarButton", preventamobile.ui.altaLineaPedido().selectorBusqueda);

    //$(document).on("blur", "#artbus", preventamobile.ui.altaLineaPedido().buscarPorCodigo);

    //$(document).on("blur", "#artbus2", preventamobile.ui.altaLineaPedido().buscar);

    $(document).on('blur', "#cantidad", function () {

        var oEle = $('#cantidad')

        if (oEle.val().length > 7 || !$.isNumeric(oEle.val())) {
            if (oEle.val() != '') {
                alert('Ingrese un dato numérico')
            }
            oEle.val("")
            return false;

        }
    });
    $(document).on('blur', "#editaLineaCantidad", function () {

        var oEle = $('#editaLineaCantidad')

        if (oEle.val().length > 7 || !$.isNumeric(oEle.val())) {
            if (oEle.val() != '') {
                alert('Ingrese un dato numérico')
            }
            oEle.val("")
            return false;

        }
    });

    $(document).on('blur', "#bonif1", function () {

        var oEle = $('#bonif1')
        if (oEle.val().length > 7 || !$.isNumeric(oEle.val())) {
            if (oEle.val() != '') {
                alert('Ingrese un dato numérico')
            }
            oEle.val("")
            return false;

        }
    });

    $(document).on('blur', "#editaLineaBonif1", function () {

        var oEle = $('#editaLineaBonif1')
        if (oEle.val().length > 7 || !$.isNumeric(oEle.val())) {
            if (oEle.val() != '') {
                alert('Ingrese un dato numérico')
            }
            oEle.val("")
            return false;

        }
    });

    function escapeRegExp(string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    function replaceAll(string, find, replace) {
        return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    $(document).on('blur', "#textObserva", function () {

        var oEle = $('#textObserva')
        oEle.val( replaceAll(oEle.val(), '"', ''))
        oEle.val( replaceAll(oEle.val(), '{', ''))
        oEle.val( replaceAll(oEle.val(), '}', ''))
        return false;


    });

    $(document).on('click', "#BacklistaArticulosPedidoPage", function () {
        preventamobile.ui.altaLineaPedido().atras();
        return false;
    });



});

//@ sourceURL=_index.js