Craft.loader.Import({ css : "/css/craftcode.css" , cache : false});

Craft.WhenReady().then(Scope => {
  if(location !== '#home') location = '#home';

}).catch(err => console.error(err));
