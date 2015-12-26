//Craft.Import({css : './css/admin.css' , cache : false});
"use strict";
Craft.WhenReady().then(Scope => {

//let adminChannel = new CraftSocket('wss://192.168.10.108:3443/admin-channel');

if(location.hash === '') location.hash = '#new-post';

query('side-bar').setToggler(".sidebar-toggle",open => {
  if(open) {
    dom('.sidebar-toggle').css({
      left:'210px',
      background : ''
    });
    dom('main').css({
      left:'200px'
    });
  } else {
    dom('.sidebar-toggle').css({
      left:'10px',
      background : 'rgb(233, 12, 58)'
    });
    dom('main').css({
      left:''
    });
  }
});
query('side-bar').toggle(false);

Craft.router.handle('#new-post',() => {
 query('[link="#new-post"]').setAttribute('selected','');


});

Craft.newComponent('info-bar',{
  inserted() {

  },
  destroyed() {

  }
});


}).catch(err => console.error(err))
