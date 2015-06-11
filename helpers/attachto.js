function pre(vnode, newVnode) {
  var attachData = vnode.data.attachData;
  // Copy created placeholder and real element from old vnode
  newVnode.data.attachData.placeholder = attachData.placeholder;
  newVnode.data.attachData.real = attachData.real;
  // Mount real element in vnode so the patch process operates on it
  vnode.elm = vnode.data.attachData.real;
}

function post(_, vnode) {
  // Mount dummy placeholder in vnode so potential reorders use it
  vnode.elm = vnode.data.attachData.placeholder;
}

function destroy(vnode) {
  // Remove real element from where it was inserted
  var attachData = vnode.data.attachData;
  attachData.target.removeChild(attachData.real);
}

function create(_, vnode) {
  var real = vnode.elm, attachData = vnode.data.attachData;
  var placeholder = document.createElement('span');
  // Replace actual element with dummy placeholder
  // Snabbdom will then insert placeholder instead
  vnode.elm = placeholder;
  attachData.target.appendChild(real);
  attachData.real = real;
  attachData.placeholder = placeholder;
}

module.exports = function(target, vnode) {
  if (vnode.data === undefined) vnode.data = {};
  if (vnode.data.hook === undefined) vnode.data.hook = {};
  var data = vnode.data;
  var hook = vnode.data.hook;
  data.attachData = {target: target, placeholder: undefined, real: undefined};
  hook.create = create;
  hook.prepatch = pre;
  hook.postpatch = post;
  hook.destroy = destroy;
  return vnode;
};
