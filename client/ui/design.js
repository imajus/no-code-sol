import { DefinitionWalker } from 'sequential-workflow-designer';
import { Session } from 'meteor/session';
import { TemplateController } from 'meteor/space:template-controller';
import { createDesigner } from '/api/editor';
import { AppStorage } from '/api/storage';
import './editor/components/playground';
import './design.html';

TemplateController('Design', {
  state: {
    walker: null,
    designer: null,
    ready: false,
  },
  onCreated() {
    this.state.walker = new DefinitionWalker();
  },
  onRendered() {
    const storage = new AppStorage('definition');
    const state = storage.get() ?? {
      properties: {},
      sequence: [],
    };
    const designer = createDesigner(
      this.find('#designer'),
      this.state.walker,
      state,
    );
    designer.onReady.subscribe(() => {
      this.state.ready = true;
    });
    designer.onDefinitionChanged.subscribe(() => {
      const definition = designer.getDefinition();
      storage.set(definition);
    });
    this.state.designer = designer;
  },
  helpers: {
    showPlayground() {
      const { ready } = this.state;
      return ready && Session.get('playground');
    },
  },
});
