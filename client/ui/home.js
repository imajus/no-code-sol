import { DefinitionWalker } from 'sequential-workflow-designer';
import { TemplateController } from 'meteor/space:template-controller';
import { /* editorProvider, */ createDesigner } from '/api/editor';
import { AppStorage } from '/api/storage';
import 'sequential-workflow-designer/css/designer.css';
import 'sequential-workflow-designer/css/designer-light.css';
import 'sequential-workflow-editor/css/editor.css';
import './editor/components/playground';
import './home.html';
import './home.css';

TemplateController('Home', {
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
    }; //editorProvider.activateDefinition();
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
});
