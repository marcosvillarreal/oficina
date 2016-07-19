var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.gridCargaRapidaArticulo = function () {

    var render,
        clickBoton,
        lanzarLista,
        guardarListaRapida;

    guardarListaRapida = function () {

        var valoresIngresados = $(".listaRapidaInput");

        var pedidoId = localStorage.getItem("CurrentPedidoId");

        $.each(valoresIngresados, function (index, value) {
            var dal = preventamobile.dal();
            var control = $(value);
            var lineaId = control.data("linea");
            var idArticulo = control.data("articulo");
            var cantidad = parseInt(control.val());

            if (cantidad <= 0) {
                if (lineaId) {
                    // Cantidad 0 en linea preexistente, remover
                    dal.eliminarPedidoLinea(pedidoId, lineaId);
                }
            } else {
                dal.guardarPedidoLinea(pedidoId, dal.factory().lineaPedidoDesdeCargaRapida(idArticulo, cantidad));
            }
        });

        // Luego de guardar direccionar a la pagina de lista de articulos para el pedido
        $.mobile.changePage('#listaArticulosPedidoPage');
        
    };

    render = function () {

        var dal = preventamobile.dal();

        var html = "";

        var articulos = dal.articulosLista();

        // verifico que tenga articulos la seccion sino no la muestro
        if (articulos.length > 0) {

            var pedidoId = localStorage.getItem("CurrentPedidoId");

            html = html + "<ul id='cargaRapidaList' data-theme='a' data-role='listview' data-inset='true' data-autodividers='false' data-filter='true' data-filter-placeholder='Ingrese letras a buscar'>";

            $.each(articulos, function (index2, value2) {
                
                html = html + "<li><a href='#' onclick='preventamobile.ui.gridCargaRapidaArticulo().clickBoton(" + '"' + value2.idarticulo + '"' + ");' >" + value2.numero + ' - ' + value2.nombre + " $" + value2.preventa1 + "</a>";

                // Primer version, mas de una linea no permite la edicion de la cantidad
                var resultado = dal.listarPedidoLineasPorArticulo(pedidoId, value2.idarticulo);
                if (resultado.lineas.length > 1) {
                    html = html + "<label data-theme='b' class='ui-li-aside'>" + resultado.total + "</label>";
                } else {
                    if (resultado.lineas.length === 1) {
                        html = html + "<input type='number' data-theme='b' class='listaRapidaInput ui-li-aside' value='" + resultado.total + "' data-articulo='" + value2.idarticulo.trim() + "' data-linea='" + resultado.lineas[0].lineaId + "' />";
                    } else {
                        html = html + "<input type='number' data-theme='b' class='listaRapidaInput ui-li-aside' value='" + resultado.total + "' data-articulo='" + value2.idarticulo.trim() + "' />";
                    }
                }

                html = html + "</li>";

            });

            html = html + "</ul>";
        }

        $('#cargaRapidaContent').html(html).trigger('create');

    };

    lanzarLista = function () {
        $.mobile.changePage('#gridCargaRapidaArticuloPage');
    };
    
    clickBoton = function (idArticulo) {

        preventamobile.ui.listaPedidos().establecerIdArticuloSeleccionado(idArticulo);
        preventamobile.ui.listaPedidos().limpiarLineaSeleccionada();
        var articulo = preventamobile.dal().obtenerArticulo(idArticulo.trim());

        if (articulo.variedades.length > 0) {
            $.mobile.changePage('#editaLineaVariedadesPage');
        } else {
            $.mobile.changePage('#editaLineaPedidoPage');
        }

    };

    return {
        render: render,
        clickBoton: clickBoton,
        lanzarLista: lanzarLista,
        guardarListaRapida: guardarListaRapida
    };
    
};

//@ sourceURL=_gridcargarapidaarticulo.js