var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.editaLineaVariedades = function () {

    var guardarLinea,
        borrarLinea,
        render,
        clickBoton,
        buscarLineaVariedadPorVariedad;

    buscarLineaVariedadPorVariedad = function(linea, idVariedad) {
        for (var variedad in linea.variedades) {
            if (linea.variedades[variedad].idvariedad == idVariedad) return linea.variedades[variedad];
        }
        return undefined;
    }

    render = function () {

        var articuloId = preventamobile.ui.listaPedidos().obtenerIdArticuloSeleccionado();
        var articulo = preventamobile.dal().obtenerArticulo(articuloId);

        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        var pedido = preventamobile.dal().obtenerPedido(pedidoId);

        var lineaId = preventamobile.ui.listaPedidos().obtenerIdLineaSeleccionada();

        var linea = preventamobile.dal().obtenerPedidoLinea(pedidoId, lineaId);

        if (!articulo || !pedido) {
            alert("No se puede editar la linea especificada");
            return false;
        }

        // veo si es una linea nueva
        if (!linea) {
            linea = preventamobile.dal().factory().lineaPedido();
            linea.idarticulo = articuloId;
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
        }

        var html, controlhtml;

        html = "<div data-role='navbar'><ul>" +
            "<li><a href='#homePage' data-icon='home' data-iconpos='notext'>Inicio</a></li>" +
            "<li><a href='#listaArticulosPedidoPage' data-icon='back' >Atrás</a></li>" +
            "<li><a href='#' data-icon='delete' onclick='preventamobile.ui.editaLineaVariedades().borrarLinea();'>Borrar</a></li>" +
            "<li><a href='#' data-icon='check' onclick='preventamobile.ui.editaLineaVariedades().guardarLinea();'>Guardar</a></li></ul></div>";
        $("#headerEditaLineaVariedad").html(html).trigger('create');

        html = "";

        controlhtml = "<div data-role='fieldcontain' class='ui-hidden-accessible'><label id='lineaIdpedido'>" + pedidoId + "</label>" + "</div>";
        html = html + controlhtml;
        controlhtml = "<div data-role='fieldcontain'><label>Artículo:" + articulo.numero + " - " + articulo.nombre + "</label>" + "</div>";
        html = html + controlhtml;

        // propagar las variedades

        // TODO: falta hacer un match entre las lineas guardadas y el id de la variedad, porque si cambia el array de variedades del articulo vamos a tener errores
        // TODO: esto debe hacerse todo en el dal y la carga de datos de esto es un template

        if (articulo.variedades.length > 0) {
            var nhtml = "<fieldset class='ui-grid-a'>";
            for (var index = 0; index < articulo.variedades.length; index++) {

                var cantVar = "";

                var lineaVariedad = buscarLineaVariedadPorVariedad(linea,articulo.variedades[index].id);
                // si no existe la linea en el lStorage
                if (lineaVariedad) {
                    cantVar = lineaVariedad.cantidad;
                };

                nhtml = nhtml + "<div class='ui-block-x'>";
                nhtml = nhtml + "<button id='btnvar" + index + "' type='submit' data-theme='b' onclick='preventamobile.ui.editaLineaVariedades().clickBoton(" + '"' + index + '"' + ");' >" + articulo.variedades[index].codigo + ' - ' + articulo.variedades[index].detalle + "</button></div>";
                nhtml = nhtml + "<div class='ui-block-y'>";
                nhtml = nhtml + "<input class='canvari' id='linea" + index + "'" + " type='number' data-theme='c' value='" + cantVar + "'/></div>";

            }

            controlhtml = "</fieldset>";
            nhtml = nhtml + controlhtml;

            html = html + nhtml;
        }

        controlhtml = "<button id='btnguardar' type='submit' onclick='preventamobile.ui.editaLineaVariedades().guardarLinea();' >GUARDAR</button>";
        html = html + controlhtml;

        // Bonificaciones
        controlhtml = "<div data-role='fieldcontain'>" +
        "<label for='bonifVar1'>Bonificacion:</label><input type='number' name='bonifVar1' id='bonifVar1' style='width:70px' data-theme='c' value='" + linea.bonif1 + "' /></div>";
        html = html + controlhtml;
        // Unibulto
        controlhtml = "<div data-role='fieldcontain'>" +
        "<label for='unibulto'>Bultos x:</label><input type='number' name='unibulto' id='unibulto' style='width:70px' data-theme='c' value='" + linea.unibulto + "' /></div>";
        html = html + controlhtml;
        // Unidad de Venta
        controlhtml = "<div data-role='fieldcontain'>" + "<label for='sliderUniventaVar'>Presentación:</label>" +
            "<select name='sliderUniventaVar' id='sliderUniventaVar' data-role='slider'><option value='off'>Unidad</option><option value='on'>Bulto</option></select>" + "</div>";
        html = html + controlhtml;

        $("#editaLineaVariedadesContent").html(html).trigger('create');

        $(document).on('blur', ".canvari", function () {

            var oEle = $(this)
            if (oEle.val().length > 7 || !$.isNumeric(oEle.val())) {
                if (oEle.val() != '') {
                    alert('Ingrese un dato numérico');
                }
                oEle.val("");
                return false;

            }
        });

        var toggle = $("#sliderUniventaVar");
        if (linea.univenta == "0") { toggle.val("off"); } else { toggle.val("on"); };
        toggle.slider("refresh");
        $('#unibulto').attr('readonly', true);
        $('#linea0').focus();

        return false;
    };

    clickBoton = function (numeroLinea) {
        var caja = "#linea" + numeroLinea;
        $(caja).val("");
        $(caja).focus();
    };

    guardarLinea = function () {

        var articuloId = preventamobile.ui.listaPedidos().obtenerIdArticuloSeleccionado();
        var articulo = preventamobile.dal().obtenerArticulo(articuloId);

        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();

        var lineaId = preventamobile.ui.listaPedidos().obtenerIdLineaSeleccionada();
        var linea = preventamobile.dal().obtenerPedidoLinea(pedidoId, lineaId);

        // veo si es una linea nueva
        if (!linea) {
            linea = preventamobile.dal().factory().lineaPedido();
            linea.idarticulo = articuloId;
            linea.codigoArticulo = articulo.numero;
            linea.cantidad = "";
            linea.bonif1 = articulo.bonif1;
            linea.univenta = articulo.univenta;
            linea.unibulto = articulo.unibulto;

            lineaId = linea.lineaId;
        }

        // guardo las propiedades de la linea para todos los sabores
        var caja, cantVar;
        var uniVenta;
        var signo = 1;
        linea.bonif1 = $('#bonifVar1').val();
        if ($('#sliderUniventaVar').val() == "on") { uniVenta = "1"; } else { uniVenta = "0"; };
        if ($('#sliderVenta').val() == "on") { signo = -1; } else { signo=1; };
        linea.univenta = uniVenta;
        linea.unibulto = $('#unibulto').val();
        linea.precio = articulo.preventa1;

        preventamobile.dal().guardarPedidoLinea(pedidoId, linea);

        if (articulo.variedades.length > 0) {
            var lineaVariedad;
            for (var index = 0; index < articulo.variedades.length; index++) {
                caja = "#linea" + index;
                cantVar = $(caja).val() * signo;
                lineaVariedad = buscarLineaVariedadPorVariedad(linea, articulo.variedades[index].id);
                if (!lineaVariedad) {
                    lineaVariedad = preventamobile.dal().factory().lineaVariedad();
                }

                // asigno los valores a los campos        
                lineaVariedad.cantidad = cantVar || 0;
                lineaVariedad.lineaId = linea.lineaId;
                lineaVariedad.idarticulo = articuloId;
                lineaVariedad.codigoArticulo = articulo.numero;
                lineaVariedad.idvariedad = articulo.variedades[index].id;
                lineaVariedad.codigoVariedad = articulo.variedades[index].codigo;
                preventamobile.dal().guardarLineaVariedad(pedidoId, lineaId, lineaVariedad);
            }
        }
     
        $.mobile.changePage('#altaLineaPedidoPage');
    };

    borrarLinea = function () {
        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        var lineaId = preventamobile.ui.listaPedidos().obtenerIdLineaSeleccionada();
        preventamobile.dal().eliminarPedidoLinea(pedidoId, lineaId);
        $.mobile.changePage('#listaArticulosPedidoPage');
    };

    return {
        render: render,
        guardarLinea: guardarLinea,
        borrarLinea: borrarLinea,
        clickBoton: clickBoton
    };
};

//@ sourceURL=_editalineavariedades.js