const custonExpress = require('./src/config/custonExpress');

const app = custonExpress();

app.listen(4000, ()=>{
    console.log('server ON');
});