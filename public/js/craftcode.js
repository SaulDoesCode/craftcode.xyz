"use strict";
Craft.WhenReady().then(Scope => {
  Scope.signedin = false;
  if (Scope.signedin === false) {
    Craft.Import({script : './js/accountwidget.js' , cache : false}).then(x => {
      fetch('./views/account-widget.html').then(res => res.text().then(txt => document.body.innerHTML += txt));
    });
  }

Craft.newComponent('top-bar', {
  created() {

  }
});
Craft.newComponent('nav-item', {
  created() {
      var element = this;
      this.OnClick = On('click', this, e => {
        queryEach('nav-item', el => el.style.color = '');
        dom(element).css({
          color: dom(element).getAttr('color-accent'),
          textShadow: '0 1px 2px hsla(0, 0%, 20%, 0.3)'
        });
      });
    },
    destroyed() {
      this.OnClick.Off();
    }
});

}).catch(err => console.error(err));
