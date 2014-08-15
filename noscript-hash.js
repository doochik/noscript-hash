// переопределяем ns.history.js, чтобы он работал через хеш, а не через History API

ns.router.URL_FIRST_SYMBOL = '#';

/**
 *
 */
ns.history.init = function() {
    window.addEventListener('hashchange', ns.history.onpopstate, false);
};

/**
 *
 * @param {string} url
 * @param {string} title
 */
ns.history.pushState = function(url, title) {
    ns.page.forceHashChange = url;
    console.log('ns.history.pushState', url, title);
    window.location.href = url;
};

/**
 *
 * @param {string} url
 * @param {string} title
 */
ns.history.replaceState = function(url, title) {
    ns.page.forceHashChange = url;
    console.log('ns.history.replaceState', url, title);
    window.location.replace(url);
};

/**
 *
 */
ns.history.onpopstate = function() {
    var hash = ns.page.getCurrentUrl();

    var forceHashChange = ns.page.forceHashChange;
    var forceHashChange_decoded;
    try {
        forceHashChange_decoded = decodeURIComponent(forceHashChange);
    } catch(e) {
    }
    // Мы сами вызвали этот hashchange, так что его нужно проигнорировать. Действие уже совершено.
    if ((forceHashChange && forceHashChange == hash) ||
        /*
         Fx может сам перекодироват хеш из #contacts/chats/488229132%40qip.ru в #contacts/chats/488229132@qip.ru,
         чем вызовет событие hashchange и перерисовку
         */
        (forceHashChange_decoded && forceHashChange_decoded == hash)
        ) {
        return false;
    }
    ns.page.go(hash);
};
