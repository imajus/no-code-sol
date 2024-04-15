// import SimpleSchema from 'simpl-schema';
import { TemplateController } from 'meteor/space:template-controller';
import { Web3Accounts } from 'meteor/majus:web3';
import { AppStorage } from '/api/storage';
import { compile } from '/api/compiler';
import './root.html';

function download(filename, data) {
  const blob = new Blob([JSON.stringify(data)], { type: 'text/json' });
  const link = document.createElement('a');
  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');
  const evt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  link.dispatchEvent(evt);
  link.remove();
}

async function upload() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', (e) => {
      const [file] = e.target.files;
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = ({ target: { result } }) => resolve(result);
      reader.onerror = () => reject(reader.error);
      input.remove();
    });
    const evt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(evt);
  });
}

TemplateController('EditorRoot', {
  // props: new SimpleSchema({}),
  state: {},
  onCreated() {},
  onRendered() {},
  helpers: {},
  events: {
    'click [data-action=exportSequence]'() {
      const definition = new AppStorage('definition');
      const input = new AppStorage('input');
      download(`NoCodeSol-${new Date().toISOString()}.json`, {
        definition: definition.get(),
        input: input.get(),
      });
    },
    async 'click [data-action=importSequence]'() {
      const definition = new AppStorage('definition');
      const input = new AppStorage('input');
      const json = await upload();
      const data = JSON.parse(json);
      if ('definition' in data) {
        definition.set(data.definition);
      }
      if ('input' in data) {
        input.set(data.input);
      }
      window.location.reload();
    },
    'click [data-action=resetSequence]'() {
      const definition = new AppStorage('definition');
      const input = new AppStorage('input');
      definition.reset();
      input.reset();
      window.location.reload();
    },
    async 'click [data-action=generate]'(e) {
      const { definition } = this.data;
      const { format } = e.target.dataset;
      switch (format) {
        case 'ast':
          {
            const ast = await compile(definition);
            download('NoCodeSol-AST.json', ast);
          }
          break;
        case 'abi':
          alert('Not implemented');
          break;
        case 'sol':
          alert('Not implemented');
          break;
        default:
          alert('Not supported');
      }
    },
    'click [data-action=connect]'() {
      Web3Accounts.connect();
    },
    'click [data-action=deploy]'() {
      const ast = await compile(definition);
      download('NoCodeSol-AST.json', ast);
    },
  },
  private: {},
});
