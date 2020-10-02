const fs = require('fs');
const unified = require('unified')
const markdown = require('remark-parse')
const remark2rehype = require('remark-rehype');
const stringify = require('remark-stringify')

fs.readdirSync('./output').forEach(file => {
  fs.unlinkSync(`./output/${file}`)
});

const file = fs.readFileSync('./doc9.md', 'utf-8').replace(/images/g, '/docs/assets/images');

const tree = unified().use(markdown).parse(file)

function getTitle(node) {
  if(node.type === 'heading') {
    return node.children[0].value;
  }
  return 'Untitled';
}

function run() {
  const global = [];
  let current = [];
  for(const node of tree.children) {
    if(node.type === 'heading' && node.depth === 2) {
      global.push(current);
      current = [];
      current.push(node);
    } else {
      current.push(node);
    }
  }
  if(current.length > 0) {
    global.push(current);
  }

  global.forEach((children, index) => {
    const ast = {
      type: 'root',
      children
    }
    const metadata = `---
id: doc${index > 9 ? index : `0${index}`}
title: ${getTitle(children[0])}
---
    `
    const data = unified().use(markdown).use(remark2rehype).use(stringify).stringify(ast);
    
    fs.writeFileSync(`./output/doc${index > 9 ? index : `0${index}`}.md`, metadata + '\n' +data);
  })

  console.log('Finished');
}

run();