dom('[crafterstyles]').append(`
  user-widget {
    position:absolute;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    align-content: center;
    justify-content: center;
    top:5px;
    right:5px;
    background: #fff;
    border-radius: 3px;
    border-width:1px;
    border-style:solid;
    width:180px;
    height:45%;
    z-index: 10;
  }
  user-widget > .username {
    position:relative;
    display:inline-flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    width:80%;
    font-size: 1.2em;
    color:#c8aa7d;
    text-shadow:0 1px 2px hsla(0, 0%, 10%, 0.3);
  }
  user-widget[status="online"] {
    border-color:#2cbd01;
  }
  user-widget[status="away"] {
    border-color:#f0ae1a;
  }
`);

Craft.newComponent('user-widget',{
  inserted() {
    dom('.username',this).html(Craft.getBind('auth').username);
  },
  attr(name,oval,nval) {
    if(name === 'status' && oval !== nval) {

    }
  },
  destroyed() {

  }
});
Craft.scope.awaycheckers = {};

On('blur',e => {
  Craft.scope.awaycheckers.timer = setTimeout(() => {
    if(Craft.getBind('auth.status') === 'away') {
      Scope.queryOnline.send('online', res => {
        Craft.setBind('auth',JSON.parse(res));
      });
    }
  }, 120000);

  Craft.scope.awaycheckers.ticker = setInterval(() => {
    if(Craft.tabActive === true) {
      Craft.setBind('auth.status','online');
      clearInterval(Craft.scope.awaycheckers.ticker);
      clearTimeout(Craft.scope.awaycheckers.timer);
    } else Craft.setBind('auth.status','away');
  }, 5000);
});

On('focus', e => {
  if(is.Def(Craft.scope.awaycheckers.ticker,Craft.scope.timer)) {
    clearInterval(Craft.scope.awaycheckers.ticker);
    clearTimeout(Craft.scope.awaycheckers.timer);
  }
});


dom('top-bar').append(Craft.make_element('user-widget',dom().div('','class=username'),true));
