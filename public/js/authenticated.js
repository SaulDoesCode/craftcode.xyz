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
    border:2px solid #2cbd01;
  }
`);

Craft.newComponent('user-widget',{
  inserted() {
    dom('.username',this).html(Craft.Scope.auth.username);
    let status = 'online', queryOnline = new CraftSocket('wss://192.168.10.108:3443/queryonline');
    queryOnline.send(status,res => {
      console.log(res);
      setTimeout(() => queryOnline.close(), 500);
    });
  },
  destroyed() {

  }
});

On('blur', e => Craft.tabActive = false);
On('focus', e => Craft.tabActive = true);

window.onbeforeunload = () => {
    let queryOnline = new CraftSocket('wss://192.168.10.108:3443/queryonline');
    queryOnline.send('offline',res => {
      console.log('offline');
      setTimeout(() => queryOnline.close(), 50);
      window.onbeforeunload = null;
    });
  //return "setting status to offline";
}

dom('top-bar').append(Craft.make_element('user-widget',dom().div('','class=username'),true));
