"use strict";

Craft.WhenReady.then(Scope => {

  On('storage', e => console.log(e));


  Craft.newComponent('page-view', {
      attr(name, oldval, newval) {
        let el = dom(this);
        if (name === 'active' && el.hasAttr('active')) {
          if (el.hasAttr('src') && !el.hasAttr('fetched')) fetch(el.getAttr('src'))
          .then(res => res.text())
          .then(view => el.html(view).setAttr('fetched'));
        }
      }
  });

  Craft.newComponent('top-bar', {
    created() {

    }
  });

  Craft.newComponent('nav-item', {
    created() {
        let element = dom(this);
        this.OnClick = element.Click(e => {
          queryEach('nav-item', el => {
            el.style.color = '';
            el.style.zIndex = '';
            el.style.textShadow = '';
          });
          element.css({
            color: element.getAttr('color-accent'),
            zIndex: '3',
            textShadow: '0 1px 2px hsla(0, 0%, 20%, 0.3)'
          });
        });
      },
      setState(active) {
        let el = dom(this);
        el.css({
          color: active ? el.getAttr('color-accent') : '',
          zIndex: active ? '3' : '',
          textShadow: active ? '0 1px 2px hsla(0, 0%, 20%, 0.3)' : ''
        });
      },
      destroyed() {
        this.OnClick.Off;
      }
  });

  Craft.router.handle(['#code', '#about', '#crafter.js'], () => {
    queryEach('page-view[active]', pv => dom(pv).stripAttr('active'));
    queryEach('nav-item', nv => nv.setState());
    setTimeout(() => {
      query(`page-view[name="${location.hash}"]`).setAttribute('active', '');
      query(`nav-item[link="${location.hash}"]`).setState(true);
    }, 20);
  });


}).catch(err => console.error(err));
