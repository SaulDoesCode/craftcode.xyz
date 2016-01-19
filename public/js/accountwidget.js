"use strict";
((doc,root) => {

let SignIn = {
  set EmailorUsername(val) {
    let UorE = val.trim() , manip = dom('sign-in > [name="username"]');
    this.uorevalid = false;
    manip.css({borderColor : 'red'});
    if (UorE.length < 1) Craft.setBind("FormState", "Empty Username or Email field");
    else if (UorE.includes(".") && !UorE.includes("@")) Craft.setBind("FormState", "Username shouldn't contain a point .");
    else if (UorE.includes("@") && UorE.includes(" ")) Craft.setBind("FormState", "Email contains a space");
    else if (UorE.includes("@") && !is.Email(UorE)) Craft.setBind("FormState", "Email is invalid");
    else if (!is.Alphanumeric(UorE) && !UorE.includes("@")) Craft.setBind("FormState", "Username should be alphanumeric");
    else if (UorE.lenth > 45 && !UorE.includes("@")) Craft.setBind("FormState", "Username is too long (max 45)");
    else {
      manip.css({borderColor : 'green'});
      Craft.setBind("FormState"," ");
      this.uore = UorE;
      this.uorevalid = true;
      this.valid = is.True(this.uorevalid,this.passvalid);
    }
  },
  set Password(val) {
    let pass = val.trim(),
      strongPass = Craft.strongPassword(pass, 8, false, true, true);
    this.passvalid = false;
    if (is.String(strongPass) || strongPass === false) dom('sign-in > [name="password"]').css({borderColor : 'red'});
    if (pass.length < 1) Craft.setBind("FormState", "Empty Password field");
    else if (pass.includes(" ")) Craft.setBind("FormState", "Password should not contain a space");
    else if (pass.length > 45) Craft.setBind("FormState", "Password too long (max 45)");
    else if (strongPass === true) {
      this.passvalid = true;
      this.pass = pass;
      Craft.setBind("FormState", " ");
      dom('sign-in > [name="password"]').css({borderColor : 'green'});
      this.valid = is.True(this.uorevalid,this.passvalid);
    } else Craft.setBind("FormState",strongPass);
  },
  pass : '',
  uore : '',
  passvalid : false,
  uorevalid : false,
}

Craft.newComponent('account-widget', {
  inserted() {
      let el = dom(this) , togglebutton = query('toggle-button', this);
      el.hasAttr('open') ? this.show() : this.hide();
      this.clickClose = On('.close', this).Click(e => this.hide());
      togglebutton.func = state => {
        el.setAttr('state',state);
        Craft.setBind('AccountWidgetToggle', state ? 'Sign Up': 'Sign In');
      }
    },
    toggle(open) {
      is.Def(open) && open || dom(this).hasAttr('open') ? this.show() : this.hide()
    },
    show() {
      this.setAttribute('open', '')
    },
    hide() {
      if (this.hasAttribute('open')) this.removeAttribute('open')
    },
    destroyed() {
      if(is.Def(this.clickEvent)) this.clickEvent.Off();
      if(is.Def(this.clickClose)) this.clickClose.Off();
    }
});

Craft.newComponent('account-toggle', {
  inserted() {
      let aw = dom('account-widget');
      this.toggle = aw.hasAttr('open');
      this.toggleClick = On(this).Click(e => {
        this.toggle = !aw.hasAttr('open');
        this.toggle ? aw.show() : aw.hide();
      });
    },
    destroyed() {
      this.toggleClick.Off();
    }
});

Craft.newComponent('google-button', {
  inserted() {
    this.innerHTML = 'Google'
  }
});
Craft.newComponent('github-button', {
  inserted() {
    this.innerHTML = 'Github'
  }
});

Craft.newComponent('sign-in', {
  inserted() {
      Craft.InputSync('sign-in > [name="username"]',SignIn,'EmailorUsername');
      Craft.InputSync('sign-in > [name="password"]',SignIn,'Password');

      this.signIn = On('.sign-in-button', this).Click(e => {
        if (SignIn.valid === true) fetch('/signin', {
          method: 'POST',
          mode: 'same-origin',
          body: JSON.stringify({
            Username: SignIn.uore,
            Password: SignIn.pass,
          }),
          redirect: 'manual',
          credentials: 'same-origin',
          headers: new Headers({
            'Content-Type': 'text/json'
          })
        }).then(res => res.json()).then(obj => {

          if (obj.authorized === "true") {
            Craft.notification(obj.msg, 'good', 'top-middle',10000);
            obj.timestamp = new Date();
            Craft.Scope.auth = obj;

             let auth,queryOnline = new CraftSocket(`wss://${location.host}/queryonline`);

              queryOnline.send('online', res => {
                console.log(res);
                try {
                  auth = JSON.parse(res);
                  localStorage.setItem('auth', res);
                } catch (e) {
                  Craft.notification("Sorry An Error has occured with Authorization, please try again later", 'bad', 'top-middle',10000);
                }
                if(auth.authorized == "true") {
                  Craft.Import({
                    script: './js/authenticated.js',
                    cache: false
                  }).then(() => {
                    console.log('made it this far');
                    queryOnline.close();
                    queryEach('account-widget,account-toggle,[accountwidget],[key="./js/accountwidget.js"]',el => el.remove());
                  });
                } else {
                  Craft.notification("Sorry An Error has occured with Authorization, please try again later", 'bad', 'top-middle',10000);
                }

              });

          } else Craft.notification(obj.msg, 'bad', 'top-middle',10000);


        });
      });

    },
    destroyed() {
      Craft.DisconectInputSync('sign-in > [name="username"]');
      Craft.DisconectInputSync('sign-in > [name="password"]');
      if(is.Def(this.signIn)) this.signIn.Off()
    }
});


Craft.newComponent('sign-up', {
  inserted() {

      Craft.newBind('Username', '', (oldVal, newVal) => {
        this.UsernameValid = false;
        let Username = newVal.trim();
        if (Username.length < 1) Craft.setBind("FormState", "Empty Username or Email field");
        else if (Username.includes(".")) Craft.setBind("FormState", "Username shouldn't contain a point .");
        else if (!is.Alphanumeric(Username)) Craft.setBind("FormState", "Username should be alphanumeric");
        else if (Username.lenth > 45) Craft.setBind("FormState", "Username is too long (max 45)");
        else {
          this.UsernameValid = true;
          Craft.setBind("FormState", "");
        }
      });

      Craft.newBind('Email', '', (oldVal, newVal) => {
        this.EmailValid = false;
        let email = newVal.trim();
        if (email.length < 1) Craft.setBind("FormState", "Empty Email field");
        else if (email.includes("@") && email.includes(" ")) Craft.setBind("FormState", "Email contains a space");
        else if (email.includes("@") && !is.Email(email)) Craft.setBind("FormState", "Email is invalid");
        else {
          this.EmailValid = true;
          Craft.setBind("FormState", "");
        }
      });

      Craft.newBind('Password', '', (oldVal, newVal) => {
        this.PasswordValid = false;
        let pass = newVal.trim(),
          strongPass = Craft.strongPassword(pass, 7, false, true, true);
        if (is.String(strongPass) || strongPass === false) query('sign-up > input[input-bind="Password"],sign-up > input[input-bind="Password"]').style.borderColor = 'red';
        if (pass.length < 1) Craft.setBind("FormState", "Empty Password field");
        else if (pass.includes(" ")) Craft.setBind("FormState", "Password contains a space");
        else if (pass.length < 8) Craft.setBind("FormState", "Password too short (min 8)");
        else if (pass.length > 40) Craft.setBind("FormState", "Password too long (max 40)");
        else if (pass !== query('input[name="re-password"]', this).value) Craft.setBind("FormState", "Passwords do not match");
        else if (is.Bool(strongPass) && strongPass === true) {
          this.PasswordValid = true;
          Craft.setBind("FormState", "");
          query('sign-up > input[input-bind="Password"]').style.borderColor = '';
        } else {
          this.PasswordValid = false;
          Craft.setBind("FormState", strongPass === true ? "" : strongPass);
        }
      });

      Craft.newBind('RePassword', '', (oldVal, newVal) => {
        this.PasswordValid = false;
        let pass = newVal.trim(),
          strongPass = Craft.strongPassword(pass, 7, false, true, true);
        if (pass.length < 1) Craft.setBind("FormState", "Empty Password field");
        else if (pass.includes(" ")) Craft.setBind("FormState", "Password contains a space");
        else if (pass.length < 8) Craft.setBind("FormState", "Password too short (min 8)");
        else if (pass.length > 40) Craft.setBind("FormState", "Password too long (max 40)");
        else if (pass !== query('input[name="password"]', this).value.trim()) Craft.setBind("FormState", "Passwords do not match");
        else if (is.Bool(strongPass) && strongPass === true) {
          this.PasswordValid = true;
          Craft.setBind("FormState", "");
        } else {
          this.PasswordValid = false;
          Craft.setBind("FormState", strongPass === true ? "" : strongPass);
        }
      });

      this.signUp = On('click', '.sign-in-button', this, e => {
        if (this.UsernameValid === true && this.PasswordValid === true && this.EmailValid) {
          let signup = new CraftSocket('wss://192.168.10.108:3443/signup');
          signup.send(JSON.stringify({
            Username: Craft.getBind('Username'),
            Name: Craft.getBind('Name'),
            Email: Craft.getBind('Email'),
            Password: Craft.getBind('Password')
          }), res => {
            let obj = JSON.parse(res);
            if (obj.success === "true") fetch('/signin', {
              method: 'POST',
              mode: 'same-origin',
              body: JSON.stringify({
                Username: Craft.getBind('Username'),
                Password: Craft.getBind('Password')
              }),
              redirect: 'manual',
              credentials: 'same-origin',
              headers: new Headers({
                'Content-Type': 'text/json'
              })
            }).then(res => res.json()).then(obj => {

              if (obj.success === "true") {
                Craft.notification(obj.msg, 'good', 'top-middle',10000);
                localStorage.setItem('auth',JSON.stringify(obj));
                queryEach('account-widget,account-toggle,[accountwidget],[key="./accountwidget.js"]',el => el.remove());
              } else {
                Craft.notification(obj.msg, 'bad', 'top-middle',10000);
              }
            });
          });
        }
      });
    },
    destroyed() {
      this.signUp.Off()
    }
});

})(document,self);
