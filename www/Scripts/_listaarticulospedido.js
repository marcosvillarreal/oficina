var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.listaArticulosPedido = function () {

    var render,
        lineaSeleccionada;

    render = function () {

        var lineasPedido,
            articulo,
            html,pedido;
        
        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        $('#ullistartped').empty();
        lineasPedido = preventamobile.dal().listarPedidoLineas(pedidoId);
        
        // Si no hay articulos en el pedido lo mando directo a NUEVO
        if (lineasPedido.length == 0) {
            preventamobile.ui.editaLineaPedido().lineaNueva();
        }
        else {
            pedido = preventamobile.dal().obtenerPedido(pedidoId);
            html ="<h2>Total: "+pedido.total+"</h2>"
            html = html + "<div id='divpedido' data-role='fieldcontain' class='ui-hidden-accessible'><label id='xxcodigopedido'>" + "0" + "</label>" + "</div>";
            html = html + "<div class='ui-btn-text'><ol id='ullistartped' data-theme='a' data-role='listview' data-inset='true' data-autodividers='false' " +
            "data-filter='true' data-filter-placeholder='Ingrese valor a buscar'> ";

            $.each(lineasPedido, function (index, value) {
                articulo = preventamobile.dal().obtenerArticulo(value.idarticulo);
                var totalLinea = preventamobile.dal().calcularLineaTotal(value);
                html = html + "<li style='white-space:normal;' data-theme='a' ><a style='white-space:normal;'  href='#' onclick='preventamobile.ui.listaArticulosPedido().lineaSeleccionada(" +
              '"' + value.idarticulo + '"' + ',"' + value.lineaId + '"' + ");' >" + articulo.numero + " " + articulo.nombre + "<span style='font-size:150%;' class='ui-li-count'>" + "<b>" + value.cantidad + "</b> = " +totalLinea+ "</span>" + "</a></li>";
            });
            html = html + "</ol></div>";

            $("#listaArticulosPedidoContent").html(html).trigger('create');
        };
    };

    lineaSeleccionada = function (idArticulo, lineaId) {
        preventamobile.ui.listaPedidos().establecerIdLineaSeleccionada(lineaId);
        preventamobile.ui.listaPedidos().establecerIdArticuloSeleccionado(idArticulo);

        var articulo = preventamobile.dal().obtenerArticulo(idArticulo.trim());
        if (articulo.variedades.length > 0) {
            $.mobile.changePage('#editaLineaVariedadesPage');
        } else {
            $.mobile.changePage('#editaLineaPedidoPage');
        }
        ;

    };

    return {
        render: render,
        lineaSeleccionada: lineaSeleccionada
    };
    
};