export const defaultStepEditorProvider = function (step, context) {
  const root = document.createElement('div');
  const title = document.createElement('h3');
  title.innerText = `Edit ${step.type} step`;
  root.appendChild(title);

  const nameItem = document.createElement('p');
  nameItem.innerHTML = '<label>Name</label> <input type="text" />';
  const nameInput = nameItem.querySelector('input');
  nameInput.value = step.name;
  nameInput.addEventListener('input', () => {
    step.name = nameInput.value;
    context.notifyNameChanged();
  });
  root.appendChild(nameItem);
  for (const name of Object.keys(step.properties)) {
    const item = document.createElement('p');
    item.innerHTML = `<label></label> <input type="text" />`;
    item.querySelector('label').innerText = name;
    const input = item.querySelector('input');
    input.value = step.properties[name];
    input.addEventListener('input', () => {
      step.properties[name] = input.value;
      context.notifyPropertiesChanged();
    });
    root.appendChild(item);
  }
  return root;
};
