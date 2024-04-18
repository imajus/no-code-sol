// import SimpleSchema from 'simpl-schema';
import { TemplateController } from 'meteor/space:template-controller';
import { Session } from 'meteor/session';
import { Web3Accounts } from 'meteor/majus:web3';
import { AppStorage } from '/api/storage';
import { compile } from '/api/compiler';
import './root.html';

Session.setDefault('playground', false);

function download(data, { filename, type }) {
  const blob = new Blob([data], { type });
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
    'click [data-action=togglePlayground]'() {
      Session.set('playground', !Session.get('playground'));
    },
    'click [data-action=exportSequence]'() {
      const definition = new AppStorage('definition');
      const input = new AppStorage('input');
      download(
        JSON.stringify({
          definition: definition.get(),
          input: input.get(),
        }),
        {
          filename: `NoCodeSol-${new Date().toISOString()}.json`,
          type: 'application/json',
        },
      );
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
      try {
        const output = await compile(format, definition);
        switch (format) {
          case 'bin':
            download(output, {
              filename: 'NoCodeSol.bin',
              type: 'text/plain',
            });
            break;
          case 'ast':
            download(output, {
              filename: 'NoCodeSol-AST.json',
              type: 'application/json',
            });
            break;
          case 'abi':
            download(output, {
              filename: 'NoCodeSol.abi.json',
              type: 'application/json',
            });
            break;
          case 'sol':
            download(output, {
              filename: 'NoCodeSol.sol',
              type: 'text/plain',
            });
            break;
          default:
            alert('Not supported');
        }
      } catch (e) {
        alert(e.message);
      }
    },
    'click [data-action=connect]'() {
      Web3Accounts.connect();
    },
    async 'click [data-action=deploy]'() {
      const { definition } = this.data;
      try {
        const output = await compile('bin', definition);
        //TODO: Send transaction on chain
      } catch (e) {
        alert(e.message);
      }
    },
  },
  private: {},
});
