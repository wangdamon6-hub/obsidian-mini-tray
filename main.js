/**
 * Obsidian Mini Tray — close to tray. ~30 lines, zero config.
 * Forked from dragonwocky/obsidian-tray (MIT).
 * @license MIT
 */

const {Plugin,Notice} = require('obsidian');
const ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAgUlEQVR4nLWTwQmAMAxFv38FwUW8OUJn8tiZHMGbiwjuIJEqFtM0Ij6Ip7xnqQj8yThsnYy1Q0sGMMlYEVbkPk0xwop8UozQIZsROuVihC9kNUJ8hPKIc7sCCAAWhyM7ITm4TuCMZHIWcEQesnoHUY+ostAobzq4fRlBlat4fqbP7FRFRh4/2ux2AAAAAElFTkSuQmCC';

module.exports = class extends Plugin {
  onload() { this._quitting=false;
    let R; try { R=require('@electron/remote'); } catch(e) { new Notice('Mini Tray: @electron/remote missing'); return; }
    const {Tray,Menu,nativeImage}=R, w=R.getCurrentWindow(), t=new Tray(
      nativeImage.createFromDataURL(ICON)
    ); t.setToolTip('Obsidian');
    t.setContextMenu(Menu.buildFromTemplate([
      {label:'Show Obsidian', click:()=>{if(!w.isDestroyed()){w.show();w.focus();}}},
      {type:'separator'},
      {label:'Quit', click:()=>{this._quitting=true;R.app.quit();}}
    ]));
    t.on('click', ()=>{
      if(w.isDestroyed()){if(!t.isDestroyed())t.destroy();return;}
      if(w.isVisible()&&w.isFocused()) w.hide(); else {w.show();w.focus();}
    });
    const onClose=e=>{if(!this._quitting){e.preventDefault();w.hide();}}, onQuit=()=>{this._quitting=true;};
    w.on('close',onClose); R.app.on('before-quit',onQuit);
    this.register(()=>{this._quitting=true;w.removeListener('close',onClose);R.app.removeListener('before-quit',onQuit);if(!t.isDestroyed())t.destroy();if(!w.isDestroyed()&&!w.isVisible()){w.show();w.focus();}});
  }
  onunload() { this._quitting=true; }
};
