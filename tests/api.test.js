import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/early-access.js';
function makeResponse(){return {statusCode:200,headers:{},body:null,setHeader(k,v){this.headers[k]=v},status(n){this.statusCode=n;return this},json(value){this.body=value;return this}}}
const valid={fullName:'Avery Example',email:'avery@example.com',userType:'individual',country:'India',problemDescription:'Help me understand a form.',consent:true};
async function call(method,body){const res=makeResponse();await handler({method,body,headers:{'content-type':'application/json'}},res);return res}
test('API rejects invalid input before storage access',async()=>{const res=await call('POST',{...valid,email:'bad'});assert.equal(res.statusCode,400)});
test('API never confirms storage when credentials are absent',async()=>{const oldUrl=process.env.DATABASE_URL,oldSalt=process.env.RATE_LIMIT_SALT;delete process.env.DATABASE_URL;delete process.env.RATE_LIMIT_SALT;try{const res=await call('POST',valid);assert.equal(res.statusCode,503);assert.match(res.body.error,/not stored/)}finally{if(oldUrl)process.env.DATABASE_URL=oldUrl;if(oldSalt)process.env.RATE_LIMIT_SALT=oldSalt}});
test('API only accepts POST',async()=>{const res=await call('GET',null);assert.equal(res.statusCode,405)});
