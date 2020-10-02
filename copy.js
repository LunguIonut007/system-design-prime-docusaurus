const fs = require('fs');


const parserOutputPath = './parser/output';
const docsPath = './docs';

fs.readdirSync(docsPath, 'utf-8')
  .forEach(file => {
    if(file.indexOf('.md') !== -1) {
      fs.unlinkSync(`${docsPath}/${file}`)
    }
  })

const files = fs.readdirSync(parserOutputPath, 'utf-8');

files.forEach(file => {
    fs.copyFileSync(`${parserOutputPath}/${file}`, `${docsPath}/${file}`)
  })

const sidebar = {
  "docs": {
    "System design": files.map(file => file.replace('.md', ''))
  }
};

fs.writeFileSync('./website/sidebars.json', JSON.stringify(sidebar, null, 2))
