var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.precios = function () {

    var render,
        detallesprecios,
        articulosPorSeccion,
        renderPreciosDetalle;

    renderPreciosDetalle = function () {
        
        var idarticulo = localStorage.getItem("idArticuloDetallesPrecios");
        var articulo = preventamobile.dal().obtenerArticulo(idarticulo);
        if (articulo) {
            $("#preciosDetalleContent").html($.templates("#precioDetalleTmpl").render(articulo)).trigger('create');
        } else {
            // TODO: cambiar a dialog del jquery
            alert("No se encontro precios");
        }
        return false;
    };

    render = function (noTrigger) {
        
        var secciones = preventamobile.dal().seccionesLista();
        preventamobile.dal().sort(secciones, 'nombre', 1);
        if (secciones && secciones.length && secciones.length>0)
        {
            //for (var i = 0; i < secciones.length; i++) {
            //    secciones[i].articulosSeccion = preventamobile.dal().articulosSeccionLista(secciones[i].id);
            //}
            var html = $.templates("#precioListaTmpl").render({ secciones: secciones });
            if (noTrigger) {
                $("#preciosContent").html(html);
            } else {
                $("#preciosContent").html(html).trigger('create');
            }
        }
    };

    detallesprecios = function (idarticulo) {

        localStorage.setItem("idArticuloDetallesPrecios", idarticulo);
        $.mobile.changePage('#preciosDetallePage');

    };

    articulosPorSeccion = function (idseccion) {
        var sec = $('#seccion' + idseccion)
        if (sec.html().trim().length <= 0) {
            articulosSeccion = preventamobile.dal().articulosSeccionLista(idseccion);
            var html = $.templates("#precioArticuloTmpl").render({ articulosSeccion: articulosSeccion });          
            sec.html(html).trigger('create');
        };

    };

    return {
        render: render,
        detallesprecios: detallesprecios,
        articulosPorSeccion:articulosPorSeccion,
        renderPreciosDetalle: renderPreciosDetalle
    };
};

//@ sourceURL=_precios.js