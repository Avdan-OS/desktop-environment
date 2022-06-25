var powerMenu = document.getElementById("power-menu");
var powerButton = document.getElementById("power-button");

var brightnessMenu = document.getElementById("brightness-menu");
var brightnessButton = document.getElementById("brightness-button");
var brightnessSlider = document.getElementById("brightness-slider");

var layoutMenu = document.getElementById("layout-menu");
var layoutButton = document.getElementById("layout-button");
var layoutName = document.getElementById("layout-name");

var sessionMenu = document.getElementById("session-menu");
var sessionButton = document.getElementById("session-button");
var sessionName = document.getElementById("session-name");
var sessionIcon = document.getElementById("session-icon");

var clockMenu = document.getElementById("clock-menu");
var clockButton = document.getElementById("clock-button");

var Menus = {
    start() {
        powerButton.addEventListener('click', () => {
            this.toggleMenus(powerMenu);
        });
        brightnessButton.addEventListener('click', () => {
            this.toggleMenus(brightnessMenu);
        });
        layoutButton.addEventListener('click', () => {
            this.toggleMenus(layoutMenu);
        });
        sessionButton.addEventListener('click', () => {
            this.toggleMenus(sessionMenu);
        });
        clockButton.addEventListener('click', () => {
            this.toggleMenus(clockMenu);
        });

        this._setBrightness(lightdm.brightness, false);
        brightnessSlider.addEventListener('input', () => {
            this._setBrightness(brightnessSlider.value, true);
        })

        this._loadLayouts();
        this._setLayout(
            lightdm.layouts.find(layout => {
                return layout.name == lightdm.layout.name;
            }), false
        );

        this._loadSessions();
        this._setSession(
            lightdm.sessions.find(session => {
                return session.key == lightdm.default_session;
            }), false
        );
    },
    closeAllMenus() {
        powerMenu.classList.remove('show');
        brightnessMenu.classList.remove('show');
        layoutMenu.classList.remove('show');
        sessionMenu.classList.remove('show');
        clockMenu.classList.remove('show');
    },
    toggleMenus(menus) {
        if (!menus.classList.contains('show')) {
            this.closeAllMenus();
            menus.classList.add('show');
        } else {
            menus.classList.remove('show');
        }
    },

    _setBrightness(value, update = true) {
        brightnessSlider.value = value;

        if (update) {
            lightdm.brightness = value;
        }
    },

    _loadLayouts() {
        lightdm.layouts.forEach(layout => {
            let item = document.createElement('span');
            item.innerText = `${layout.description} (${layout.name.replace(' ', '_')})`;
            item.classList.add('item');

            item.addEventListener('click', () => {
                this.closeAllMenus();
                this._setLayout(layout);
            })

            layoutMenu.appendChild(item);
        })
    },
    _setLayout(layout, update = true) {
        layoutName.innerText = layout.name.replace(' ', '_').toUpperCase();

        if (update) {
            lightdm.layout = layout;
        }
    },

    _loadSessions() {
        lightdm.sessions.forEach(session => {
            let item = document.createElement('div');
            item.classList.add('item');

            let icon = document.createElement('img');
            icon.classList.add('icon')
            icon.src = `img/sessions/${session.key}.png`;
            item.appendChild(icon);

            let name = document.createElement('span');
            name.innerText = session.name;
            item.appendChild(name);

            item.addEventListener('click', () => {
                this.closeAllMenus();
                this._setSession(session);
            })

            sessionMenu.appendChild(item);
        });
    },
    _setSession(session, update = true) {
        sessionName.innerText = session.name;
        sessionIcon.src = `img/sessions/${session.key}.png`;

        if (update) {
            lightdm.default_session = session.key;
        }
    }
}

Menus.start();