const fs = require('fs');
const path = 'dist/assets/config.json';

fs.readFile(path, 'utf8', (err, data) => {
  if (err) throw err;

  // החלף את ${ANGULAR_APP_API_URL} בערך של משתנה הסביבה
  const result = data.replace('${ANGULAR_APP_API_URL}', process.env.ANGULAR_APP_API_URL);

  fs.writeFile(path, result, 'utf8', err => {
    if (err) throw err;
    console.log('API URL replaced successfully in config.json');
  });
});
