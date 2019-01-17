'use babel';

import ProjectSpecificThemeView from './project-specific-theme-view';
import { CompositeDisposable } from 'atom';
import { File } from 'atom'

export default {

  projectSpecificThemeView: null,
  subscriptions: null,

  activate(state) {
    this.projectSpecificThemeView = new ProjectSpecificThemeView(state.projectSpecificThemeViewState);

    atom.notifications.addSuccess("Lets Rock and Roll!(project-specific-theme)",{message:'project-specific-theme engaurde!',dismissable:true});
    const file = new File(atom.project.rootDirectories[0].path+"\\theme.json");
    file.read().then(function(value){
      // console.log(value);
      var data = JSON.parse(value);
      var syntax = data.syntax;
      var ui = data.ui;
      atom.config.set('core.themes', [ui, syntax]);
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'project-specific-theme:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.projectSpecificThemeView.destroy();
  },

  serialize() {
    return {
      projectSpecificThemeViewState: this.projectSpecificThemeView.serialize()
    };
  },

  toggle() {
    const file = new File(atom.project.rootDirectories[0].path+"\\theme.json");
    var syntax_theme = atom.themes.getActiveThemeNames()[0];
    var ui_theme = atom.themes.getActiveThemeNames()[1];
    var write = '{"syntax":"'+syntax_theme+'","ui":"'+ui_theme+'"}'
    file.write(write);
    atom.themes.onDidChangeActiveThemes(function(){
      // console.log(atom.themes.getActiveThemeNames());
      var s_theme = atom.themes.getActiveThemeNames()[0];
      var o_theme = atom.themes.getActiveThemeNames()[1];
      var w = '{"syntax":"'+s_theme+'","ui":"'+o_theme+'"}';
      file.write(w);
    });

  }

}
