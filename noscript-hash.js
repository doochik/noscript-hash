/**
 * Принудительно перезагружает страницу.
 * @description Этот метод не вызывает ns.page.go, а делает полную перезагрузку страницы.
 * @param {String} [hash=location.hash]  Хэш, с которым перезагрузить страницу
 */
ns.page.forceReload = function(hash) {
    var location = window.location;
    window.removeEventListener('hashchange', ns.history.onpopstate, false);
    location.replace(hash || location.hash);
    location.reload();
};

/**
 * Тихо заменяет хеш страницы, не вызывая никаких событий и не меняя никакого состояния.
 * @param {string} newHash Новый хеш страницы.
 */
ns.page.hashReplace = function(newHash) {
    if (!newHash) { //если хэша нет, то будет /neo2/undefined
        return false;
    }

    ns.page._forceHashChange = newHash;

    // Странное поведение FF
    // если из iframe менять хэш, то заменится и location на iframe.location.href + newHash.
    // но если писать весь урл целиком, то всё хорошо
    var new_loc = window.location.href.toString().replace(/#.+$/, '') + newHash;
    window.location.replace(new_loc);

    return true;
};

/**
 * Запоминаем состояние hash, чтобы не делать двойные переходы.
 * @private
 * @type {string}
 */
ns.page._forceHashChange = null;

// переопределяем ns.history.js, чтобы он работал через хеш, а не через History API
ns.router.URL_FIRST_SYMBOL = '#';

/**
 *
 */
ns.history.init = function() {
    window.addEventListener('hashchange', ns.history.onpopstate, false);
    $(document).on('click', 'a', ns.history._onAnchorClick);
};

/**
 *
 * @param {string} url
 * @param {string} title
 */
ns.history.pushState = function(url, title) {
    ns.page._forceHashChange = url;
    window.location.href = url;
};

/**
 *
 * @param {string} url
 * @param {string} title
 */
ns.history.replaceState = function(url, title) {
    ns.page._forceHashChange = url;
    window.location.replace(url);
};

/**
 *
 */
ns.history.onpopstate = function() {
    var hash = ns.page.getCurrentUrl();

    var forceHashChange = ns.page._forceHashChange;
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
