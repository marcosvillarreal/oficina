var preventamobile = preventamobile || {};

preventamobile.configuration = function () {

    //#region Variables

    var urlServerOptions,
        setUrlBase,
        getUrlBase,
        getUrlServerOptions;

    //#endregion

    //#region Configuration
    urlServerOptions = ["http://preventa.cloudapp.net:8889/", "http://compufar.dyndns.org:8888/preventamobile/","http://localhost:8082/preventamobile/"];

    getUrlBase = function () {
        var urlServer = localStorage.getItem("urlServer");
        if (!urlServer) {
            return urlServerOptions[0];
        }
        return urlServer;
    };

    getUrlServerOptions = function () {
        return urlServerOptions;
    };

    setUrlBase = function (urlServer) {
        localStorage.setItem("urlServer", urlServer);
    };

    //#endregion

    return {
        getUrlBase: getUrlBase,
        setUrlBase: setUrlBase,
        getUrlServerOptions: getUrlServerOptions
    };
};

//@ sourceURL=_configuration.js