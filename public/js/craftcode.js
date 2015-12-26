"use strict";

Craft.WhenReady().then(Scope => {

  Scope.auth = localStorage.hasOwnProperty('auth') ? JSON.parse(localStorage.getItem('auth')) : { success : false};
  if (Scope.auth.success === false) Craft.Import({
    script: './js/accountwidget.js',
    cache: false
  }).then(() => fetch('./views/account-widget.html').then(res => res.text().then(txt => query('body').insertAdjacentHTML('afterbegin', txt))));
  else Craft.Import({
    script: './js/authenticated.js',
    cache: false
  });

  if (location.hash === '') location.hash = '#code';

  if ('1serviceWorker' in navigator) navigator.serviceWorker.register('/js/serviceworker.js').then(reg => {
      let state;
      if (reg.installing) state = 'installing';
      else if (reg.waiting) state = 'waiting';
      else if (reg.active) state = 'active';
      console.log('Service worker ' + state);
  }).catch(err => console.error('ServiceWorker registration failed: ' + err));


  Craft.newComponent('page-view', {
    inserted() {

      },
      attr(name, oldval, newval) {
        if (name === 'active' && this.hasAttribute('active')) {
          if (this.hasAttribute('src') && !this.hasAttribute('fetched')) fetch(this.getAttribute('src')).then(res => res.text().then(view => {
            this.innerHTML = view;
            this.setAttribute('fetched', '');
          }));
        }
      }
  });

  Craft.newComponent('top-bar', {
    created() {

    }
  });

  Craft.newComponent('nav-item', {
    created() {
        let element = this;
        this.mnp = dom(this);
        this.OnClick = this.mnp.On('click', e => {
          queryEach('nav-item', el => {
            el.style.color = '';
            el.style.zIndex = '';
            el.style.textShadow = '';
          });
          this.mnp.css({
            color: this.mnp.getAttr('color-accent'),
            zIndex: '3',
            textShadow: '0 1px 2px hsla(0, 0%, 20%, 0.3)'
          });
        });
      },
      setState(active) {
        this.mnp.css({
          color: active === true ? this.mnp.getAttr('color-accent') : '',
          zIndex: active === true ? '3' : '',
          textShadow: active === true ? '0 1px 2px hsla(0, 0%, 20%, 0.3)' : ''
        });
      },
      destroyed() {
        this.OnClick.Off();
      }
  });

  Craft.router.handle(['#code', '#about', '#crafter.js'], () => {
    queryEach('page-view[active]', pv => pv.removeAttribute('active'));
    queryEach('nav-item', nv => nv.setState());
    setTimeout(() => {
      query(`page-view[name="${location.hash}"]`).setAttribute('active', '');
      query(`nav-item[link="${location.hash}"]`).setState(true);
    }, 20);
  });


}).catch(err => console.error(err));
