var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.noVenta = function () {

    var render,
        detallesnoVenta;

    render = function () {
        var noVentas,
            html;
        noVentas = preventamobile.dal().noVentaLista();
        html = "<ul data-theme='a' data-role='listview' data-inset='true' data-autodividers='false' " +
            "data-filter='true' data-filter-placeholder='Ingrese letras a buscar'> ";
        $.each(noVentas, function (index, value) {
            html = html + "<li><a href='#' onclick='preventamobile.ui.noVenta().detallesnoVenta(" +
                '"' + value.Codigo + '"' + ");' ><h3>" + value.Descripcion.toUpperCase() + "*" + "</h3></a></li>";
        });
        html = html + "</ul>";

        $("#noVentaContent").html(html).trigger('create');;
    };

    detallesnoVenta = function (codigo) {

        var noVenta = preventamobile.dal().obtenerNoVenta(codigo);

        if (noVenta) {

            var dia;
            var f = new Date();
            dia = (f.getFullYear() + "-" + (f.getMonth() + 1) + "-" +f.getDate() );
            var hora = preventamobile.util().strZ(f.getHours()) + ":" + preventamobile.util().strZ(f.getMinutes()) + ":" + preventamobile.util().strZ(f.getSeconds());
            var fecha = dia + "T" + hora;


            var codigoCliente = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
            var cliente = preventamobile.dal().obtenerCliente(codigoCliente);

            var idpedido = preventamobile.util().generateUUID();
            if (noVenta.idPedido) {
                idpedido = noVenta.idPedido;
            }
            preventamobile.dal().establecerNoVenta(codigoCliente, fecha,hora, codigo , idpedido);

            // Cambio el tema x el de no venta
            var idlineacliente;
            idlineacliente = "#lcli" + cliente.numero.trim();
            $(idlineacliente).attr("data-theme", "e").trigger('mouseover');
            $(idlineacliente).removeClass('ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e')
                  .addClass('ui-btn-up-' + "e")
                  .attr('data-theme', "e");
            preventamobile.util().showDialog("<h2>" + cliente.nombre + " no compra por : " + noVenta.Descripcion + "</h2>", function () { $.mobile.changePage('#clientesPage'); });

        } else {
            preventamobile.util().showDialog("<h2>No se encontro no venta</h2>");
        }
        return false;
    };

    return {
        render: render,
        detallesnoVenta: detallesnoVenta
    };
};