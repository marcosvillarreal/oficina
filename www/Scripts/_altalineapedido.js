var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.altaLineaPedido = function () {

    var render,
        articuloSeleccionado,
        atras,
        buscarPorCodigo,
        buscar,
        calc,
        selectorBusqueda;

    render = function () {
        $('#editaLineaSliderCambioVenta').val("off");
        // Limpiar la otra busqueda al ingresar en la caja de texto de busquedas
        $("#artbus").focus(function() {
            $("#artbus2").val("");
        });
        
        $("#artbus2").focus(function() {
            $("#artbus").val("");
        });
        
        var html;
        html = "";
        preventamobile.ui.editaLineaPedido().inicializarLinea();
        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        var pedido = preventamobile.dal().obtenerPedido(pedidoId);
        if (pedido) {
            $("#altaTotalPedido").text("Total: "+pedido.total);
        };
        $("#artbus").focus();
        $("#editaLineaPedidoContent").html(html).trigger('create');

        $('#cantidad').inputmask("9999");


    };

    atras = function () {
        var indicePedido = localStorage.getItem("CurrentPedidoId");
        var listaArticulosPedido = preventamobile.dal().listarPedidoLineas(indicePedido);
        // Si no hay articulos en el pedido lo mando directo a NUEVO
        if (!listaArticulosPedido.length == 0) {
            $.mobile.changePage('#listaArticulosPedidoPage');
        } else {
            $.mobile.changePage('#listaPedidosPage');
        }
    };

    selectorBusqueda = function () {

        var codigo = $("#artbus").val();
        var texto = $("#artbus2").val();

        if (codigo) {
            buscarPorCodigo(codigo);
        } else {
            if (texto) {
                buscar(texto);
            }
        }

    }

    buscar = function (texto) {

        var sugList = $("#resultados");
        var suniventa = "";
        if (texto.length < 1) {
            sugList.html("");
            sugList.listview("refresh");
        } else {
            var lista = preventamobile.dal().articulosBuscar(texto);
            var html = "";
            if (lista.length > 0) {
                if (lista.length == 1) {
                    preventamobile.ui.altaLineaPedido().articuloSeleccionado(lista[0].id);
                }
                else {
                    $.each(lista, function (index, value) {
                        suniventa = value.univenta == "1" ? "x Bulto" : "";
                        html = html + "<li style='white-space:normal' >" + "<a id='liarti" + value.numero.trim() + "'" + " style='white-space:normal' href='#' onclick='preventamobile.ui.altaLineaPedido().articuloSeleccionado(" +
                    '"' + value.id + '"' + ");' >" + value.numero + ' - ' + value.nombre + ' $' + value.preventa1 + " " + suniventa + "</a></li>";
                    });
                }
            }
            sugList.html(html).trigger("refresh");
            sugList.listview("refresh");

        }
    };

    buscarPorCodigo = function (texto) {

        var sugList = $("#resultados");
        var suniventa = "";
        if (texto.length < 1) {
            sugList.html("");
            sugList.listview("refresh");
        } else {
            var lista = preventamobile.dal().articulosBuscarCodigo(texto);
            preventamobile.dal().sort(lista, 'numero', 1);
            var html = "";
            if (lista.length > 0) {
                if (lista.length == 1) {
                    preventamobile.ui.altaLineaPedido().articuloSeleccionado(lista[0].id);
                }
                else {
                    $.each(lista, function (index, value) {
                        suniventa = value.univenta == "1" ? "x Bulto" : "";
                        html = html + "<li style='white-space:normal' >" + "<a id='liarti" + value.numero.trim() + "'" + " style='white-space:normal' href='#' onclick='preventamobile.ui.altaLineaPedido().articuloSeleccionado(" +
                    '"' + value.id + '"' + ");' >" + value.numero + ' - ' + value.nombre + ' $' + value.preventa1 + " " + suniventa + "</a></li>";
                    });
                }
            }

            sugList.html(html).trigger("refresh");
            sugList.listview("refresh");

        }
    };

    calc = function (texto) {
        var o = $("#artbus");
        var a = o.val();

        var c = '';
        if (texto == 'OK') {
            o.trigger("change");
            o.blur();
        }
        else {

            if (texto == 'B') {
                c = (a.substr(0, a.length - 1));
            } else {
                c = (a + texto);
            }
            o.val(c);
            o.trigger('refresh');
        }
    };

    articuloSeleccionado = function (idArticulo) {

        preventamobile.ui.listaPedidos().establecerIdArticuloSeleccionado(idArticulo);
        preventamobile.ui.listaPedidos().limpiarLineaSeleccionada();

        var articulo = preventamobile.dal().obtenerArticulo(idArticulo.trim());
        if (articulo.variedades.length > 0) {
            $.mobile.changePage('#editaLineaVariedadesPage');
        } else {
            preventamobile.ui.editaLineaPedido().enviarAConfirmacionGuardarLinea(
                { articulo: articulo },
                function () {

                    window.console.log('success');

                    preventamobile.ui.editaLineaPedido().guardarLinea();
                    preventamobile.ui.editaLineaPedido().inicializarLinea();

                    var cantsel = $('#cantidad').val();

                    var sugList = $("#resultados");
                    var html = "";
                    html = html + "<li style='white-space:normal' >" + "<a style='white-space:normal' href='#' >" + articulo.numero + ' - ' + articulo.nombre + " - (" + cantsel + ")" + "</a></li>";

                    sugList.html(html).trigger("refresh");
                    sugList.listview("refresh");

                    $.mobile.changePage("#altaLineaPedidoPage");

                },
                function () {
                    preventamobile.ui.editaLineaPedido().inicializarLinea();
                    $.mobile.changePage("#altaLineaPedidoPage");
                }
            );
        };

        //};

    };

    return {
        render: render,
        articuloSeleccionado: articuloSeleccionado,
        atras: atras,
        selectorBusqueda: selectorBusqueda,
        calc: calc

    };
};


//@ sourceURL=_altalineapedido.js