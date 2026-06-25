const { execSync } = require('child_process');
const fs = require('fs');

console.log("Compiling Tailwind...");
execSync('npx tailwindcss -i ./tailwind.css -o ./output.css', { stdio: 'inherit' });

console.log("Injecting output.css into App.vue...");
const css = fs.readFileSync('output.css', 'utf8');
let app = fs.readFileSync('App.vue', 'utf8');
app = app.replace(/<style>[\s\S]*<\/style>/, '<style>\n' + css + '\n</style>');
fs.writeFileSync('App.vue', app);
console.log("Done!");
