var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.cliente = function () {

    var render,
        renderFueraRuta,
        renderClientesDetalle,
        renderinfoPedidosPage,
        linkDestino,
        detallesCliente,
        agregarCliente;

    renderClientesDetalle = function () {
        var codigo = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
        var cliente = preventamobile.dal().obtenerCliente(codigo);
        if (cliente) {
            var htmlHeader = $.templates("#clienteDetalleHeaderTmpl").render();
            $("#headerclientesDetalle").html(htmlHeader).trigger('create');
            var htmlDetalleCliente = $.templates("#clienteDetalleTmpl").render(cliente);
            $("#detalleclientesContent").html(htmlDetalleCliente).trigger('create');

            // Mostrar datos de pedidos anteriores para el cliente si existen
            var htmlPedidoAnterior = 'Sin datos';

            if (cliente.pedidoAnterior1){
                var htmlPedidoAnterior = $.templates("#pedidoAnteriorTmpl").render(cliente.pedidoAnterior1);
                if (cliente.pedidoAnterior2) {
                    htmlPedidoAnterior = htmlPedidoAnterior + $.templates("#pedidoAnteriorTmpl").render(cliente.pedidoAnterior2);
                }
            }

            $('#pedidoAnteriorCliente').html(htmlPedidoAnterior).trigger('create');

        } else {
            alert("No se encontro cliente");
        }
        return false;
    };

    render = function () {
        
        var clientes = preventamobile.dal().clientesLista();      
        $("#clientesContent").html($.templates("#clienteListaTmpl").render({ clientes: clientes })).trigger('create');
    };

    renderinfoPedidosPage = function () {
        
        var a0 = 0; var a1 = 0; var a2 = 0; var a3 = 0; var a4 = 0;
        var clientes = preventamobile.dal().clientesLista();
        
        $.each(clientes, function (index, value) {
            var codigo = value.numero.trim();
            
            var cliente = preventamobile.dal().obtenerCliente(codigo);
          
            if (cliente) {
                ++a0;
                if (cliente.tienePedido) { ++a1 };
                if (cliente.noVenta) { ++a2 };
                if (!cliente.noVenta && !cliente.tienePedido) { ++a3 };
            };
            
        });

        $('#A0').text(a0);
        $('#A1').text(a1);
        $('#A2').text(a2);
        $('#A3').text(a3);

        // Calcular total de pedidos
        
        var pedidos = preventamobile.dal().listarPedidos();

        var cantidadPedidos = 0;
        var totalPedidos = 0;

        if ((pedidos && pedidos.length && pedidos.length > 0)) {
            $.each(pedidos, function (index, value) {

                if (value.total) {

                    totalPedidos = totalPedidos + value.total;
                    cantidadPedidos = cantidadPedidos + 1;
                    
                }

            });
        }

        $('#A4').text(totalPedidos);
        if (cantidadPedidos > 0)
            $('#A5').text(totalPedidos / cantidadPedidos);
        else
            $('#A5').text(0);

        // Calcular promedio de pedidos
        
      //  $("#infoPedidosPage").html().trigger('create');
    };

    renderFueraRuta = function () {
        var clientes = preventamobile.dal().clientesFueraRutaLista();
        $("#clientesFueraRutaContent").html($.templates("#clienteFueraRutaListaTmpl").render({ clientes: clientes })).trigger('create');
    };

    detallesCliente = function (codigo) {
        preventamobile.ui.listaPedidos().establecerIdClienteSeleccionado(codigo);
        $.mobile.changePage('#clientesDetallePage');
    };

    agregarCliente = function (codigo) {
        var clientaAAgregar = preventamobile.dal().obtenerClienteFueraRuta(codigo);
        preventamobile.dal().guardarClienteEnStorage(clientaAAgregar);
        preventamobile.dal().removerClienteFueraRutaEnStorage(codigo);
        preventamobile.ui.listaPedidos().establecerIdClienteSeleccionado(codigo);
        var clientes = preventamobile.dal().clientesLista();
        $("#clientesContent").html($.templates("#clienteListaTmpl").render({ clientes: clientes })).trigger('create');
        
        preventamobile.ui.listaPedidos().pedidoNuevo();
    };

    linkDestino = function () {
        var codigoCliente = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
        var listaPedidos = preventamobile.dal().listarPedidos(codigoCliente);
        // Si no hay pedidos los mando directo a NUEVO
        if (listaPedidos.length == 0) {
            preventamobile.ui.listaPedidos().pedidoNuevo();
        } else {
            $.mobile.changePage('#listaPedidosPage');
        }
    };
    return {
        render: render,
        renderFueraRuta: renderFueraRuta,
        renderClientesDetalle: renderClientesDetalle,
        renderinfoPedidosPage: renderinfoPedidosPage,
        linkDestino: linkDestino,
        detallesCliente: detallesCliente,
        agregarCliente: agregarCliente
    };
};

//@ sourceURL=_cliente.js