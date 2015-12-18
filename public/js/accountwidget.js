Craft.newComponent('account-toggle',{
  inserted() {
    this.toggle = query('account-widget').hasAttribute('open') ? true : false;
    this.toggleClick = On('click',this,e => {
      this.toggle = query('account-widget').hasAttribute('open') ? false : true;
      this.toggle ? query('account-widget').show() : query('account-widget').hide();
    });
  },
  destroyed() {
    this.toggleClick.Off();
  }
});

Craft.newComponent('account-widget', {
  inserted() {
    this.hasAttribute('open') ? this.show() : this.hide();
    this.clickClose = On('click','.close', this,() => this.hide());
    let state = 'Sign In',
    toggleState = toggle => {
      if(toggle) {
        state = 'Sign Up';
        this.setAttribute('state','sign-up');
      } else {
        state = 'Sign In';
        this.setAttribute('state','sign-in');
      }
      Craft.setBind('account-widget-state',state);
    }
    toggleState(false);
    query('toggle-button',this).func = toggle => toggleState(toggle);
  },
  toggle(open) {
    this.hasAttribute('open') ? this.hide() : this.show()
  },
  show() {
    this.setAttribute('open', '')
  },
  hide() {
    if (this.hasAttribute('open')) this.removeAttribute('open')
  },
  destroyed() {
    this.clickEvent.Off();
    this.clickClose.Off();
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
    this.UorEvalid = false;
    this.validPass = false;

    Craft.newBind('UorE','',(oldVal,newVal) => {
      let UorE = newVal.trim();
      if (UorE.length < 1) Craft.setBind("form-state","Empty Username or Email field");
      else if (UorE.includes(".") && !UorE.includes("@")) Craft.setBind("form-state", "Username shouldn't contain a point .");
      else if (UorE.includes("@") && UorE.includes(" ")) Craft.setBind("form-state","Email contains a space");
      else if(UorE.includes("@") && !is.Email(UorE)) Craft.setBind("form-state","Email is invalid");
      else if(!is.Alphanumeric(UorE)) Craft.setBind("form-state","Username should be alphanumeric");
      else if (UorE.lenth > 45) Craft.setBind("form-state","Username is too long (max 45)");
      else {
        this.UorEvalid = true;
        Craft.setBind("form-state","");
      }
    });
    Craft.newBind('Pass','',(oldVal,newVal) => {
      let pass = newVal.trim() , strongPass = Craft.strongPassword(pass, 7, false, true,true);
      if (pass.length < 1) Craft.setBind("form-state","Empty Password field");
      else if (pass.includes(" ")) Craft.setBind("form-state","Password contains a space");
      else if (pass.length < 8) Craft.setBind("form-state","Password too short (min 8)");
      else if (pass.length > 40) Craft.setBind("form-state","Password too long (max 40)");
      else if (is.Bool(strongPass) && strongPass === true) {
        this.validPass = true;
        Craft.setBind("form-state","");
      } else {
        this.validPass = false;
        Craft.setBind("form-state",strongPass === true ? "" : strongPass);
      }
    });


    this.signIn = On('click','.sign-in-button', this, e => {
      if(this.UorEvalid === true && this.validPass === true) fetch('/signin', {
          method: 'POST',
          mode: 'same-origin',
          body : JSON.stringify({
            Username : Craft.getBind('UorE'),
            Password : Craft.getBind('Pass')
          }),
          redirect: 'manual',
          credentials : 'same-origin',
          headers: new Headers({'Content-Type': 'text/json'})
        }).then(res => {
          return res.json();
        }).then(obj => {
          Craft.setBind("form-state",obj.msg);
          if(obj.success === "true") {

          }
        });
    });

  },
  destroyed() {
    this.signIn.Off()
  }
});


Craft.newComponent('sign-up', {
  inserted() {
    this.UsernameValid = false;
    this.PasswordValid = false;
    this.EmailValid = false;

    Craft.newBind('Username','',(oldVal,newVal) => {
      this.UsernameValid = false;
      let Username = newVal.trim();
      if (Username.length < 1) Craft.setBind("form-state","Empty Username or Email field");
      else if (Username.includes(".")) Craft.setBind("form-state", "Username shouldn't contain a point .");
      else if(!is.Alphanumeric(Username)) Craft.setBind("form-state","Username should be alphanumeric");
      else if (Username.lenth > 45) Craft.setBind("form-state","Username is too long (max 45)");
      else {
        this.UsernameValid = true;
        Craft.setBind("form-state","");
      }
    });

    Craft.newBind('Email','',(oldVal,newVal) => {
      this.EmailValid = false;
      let email = newVal.trim();
      if (email.length < 1) Craft.setBind("form-state","Empty Email field");
      else if (email.includes("@") && email.includes(" ")) Craft.setBind("form-state","Email contains a space");
      else if(email.includes("@") && !is.Email(email)) Craft.setBind("form-state","Email is invalid");
      else {
        this.EmailValid = true;
        Craft.setBind("form-state","");
      }
    });

    Craft.newBind('Name','');

    Craft.newBind('Password','',(oldVal,newVal) => {
      this.PasswordValid = false;
      let pass = newVal.trim() , strongPass = Craft.strongPassword(pass, 7, false, true,true);
      if (pass.length < 1) Craft.setBind("form-state","Empty Password field");
      else if (pass.includes(" ")) Craft.setBind("form-state","Password contains a space");
      else if (pass.length < 8) Craft.setBind("form-state","Password too short (min 8)");
      else if (pass.length > 40) Craft.setBind("form-state","Password too long (max 40)");
      else if (pass !== query('input[name="re-password"]',this).value) Craft.setBind("form-state","Passwords do not match");
      else if (is.Bool(strongPass) && strongPass === true) {
        this.PasswordValid = true;
        Craft.setBind("form-state","");
      } else {
        this.PasswordValid = false;
        Craft.setBind("form-state",strongPass === true ? "" : strongPass);
      }
    });

    Craft.newBind('RePassword','',(oldVal,newVal) => {
      this.PasswordValid = false;
      let pass = newVal.trim() , strongPass = Craft.strongPassword(pass, 7, false, true,true);
      if (pass.length < 1) Craft.setBind("form-state","Empty Password field");
      else if (pass.includes(" ")) Craft.setBind("form-state","Password contains a space");
      else if (pass.length < 8) Craft.setBind("form-state","Password too short (min 8)");
      else if (pass.length > 40) Craft.setBind("form-state","Password too long (max 40)");
      else if (pass !== query('input[name="password"]',this).value.trim()) Craft.setBind("form-state","Passwords do not match");
      else if (is.Bool(strongPass) && strongPass === true) {
        this.PasswordValid = true;
        Craft.setBind("form-state","");
      } else {
        this.PasswordValid = false;
        Craft.setBind("form-state",strongPass === true ? "" : strongPass);
      }
    });

    this.signUp = On('click','.sign-in-button', this, e => {
      if(this.UsernameValid === true && this.PasswordValid === true && this.EmailValid) {
        let signup = new CraftSocket('wss://192.168.10.108:3443/signup');
        signup.send(JSON.stringify({
          Username : Craft.getBind('Username'),
          Name : Craft.getBind('Name'),
          Email : Craft.getBind('Email'),
          Password : Craft.getBind('Password')
        }), res => {
          let obj = JSON.parse(res);
          if(obj.success === "true") fetch('/signin', {
              method: 'POST',
              mode: 'same-origin',
              body : JSON.stringify({
                Username : Craft.getBind('Username'),
                Password : Craft.getBind('Password')
              }),
              redirect: 'manual',
              credentials : 'same-origin',
              headers: new Headers({'Content-Type': 'text/json'})
            }).then(res => {
              return res.json();
            }).then(obj => {
              Craft.setBind("form-state",obj.msg);
              if(obj.success === "true") {
                console.log('were in baby');
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