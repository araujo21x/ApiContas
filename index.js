const custonExpress = require('./src/config/custonExpress');

const app = custonExpress();

app.listen(3000, ()=>{
    console.log('server ON');
});