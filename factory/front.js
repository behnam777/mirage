let front = {}
const { exec } = require('child_process');
var glob = require('glob');
var deleteFolder = require('./deleteFolder');
var fs = require('fs');
var path = require('path');
var absolutePath = path.dirname(require.main.filename);
var src = path.dirname(require.main.filename) + '/src/';
//*******************************************************************************************
front.start = () => {
  return new Promise((resolve, reject) => {
    try {
      //**************************************************************************Views
      deleteFolder.delete(absolutePath + '/pages/', () => {
        fs.mkdirSync(absolutePath + '/pages/');
        let _app = `
          import '../styles/styles.css';
          export default function App({ Component, pageProps }) {
          return <Component {...pageProps} />
          } `
        fs.writeFileSync(absolutePath + '/pages/_app.js', _app);
        let pagesCounter = 0;
        glob
          .sync('**/**.jsx', { cwd: `${src}` })
          .map(result => {
            let entityName = '';
            let filename = '';
            if (result) { entityName = ((result).split('/'))[0]; filename = ((result).split('/'))[1] }
            let filePath = src + result;
            let entityFolderPath = absolutePath + '/pages/' + entityName
            if(entityName == 'index'){fs.copyFileSync(filePath, absolutePath + '/pages/')}
            if (!fs.existsSync(entityFolderPath) && entityName != 'index'){
              fs.mkdirSync(entityFolderPath);
              fs.copyFileSync(filePath, entityFolderPath + '/' + filename)
            }
            if(fs.existsSync(entityFolderPath) && entityName != 'index'){
              fs.copyFileSync(filePath, entityFolderPath + '/' + filename)
            }
            pagesCounter++
          })
        let generalStyleContent = ''
        glob
          .sync('**/**.css', { cwd: `${src}` })
          .map(result => {
            let entityName = '';
            let filename = '';
            if (result) { entityName = ((result).split('/'))[0]; filename = ((result).split('/'))[1] }
            let filePath = src + result;
            generalStyleContent += fs.readFileSync(filePath, { encoding: 'utf8' })
            generalStyleContent += '\n';
            fs.writeFileSync(absolutePath + '/styles/styles.css', generalStyleContent)
          })
          setTimeout(() => {
            exec('npm run build', (error, stdout, stderr) => {
              if (error) {
                console.error(`error: ${error.message}`);
                resolve(false);
              }
    
              if (stderr) {
                console.error(`stderr: ${stderr}`);
                resolve(false);
              }
              if (stdout) {
                resolve(true);
              }
            });
          }, pagesCounter * 170);
      })

    } catch (error) { console.log(error); }
  })
}
//*******************************************************************************************
module.exports = front;