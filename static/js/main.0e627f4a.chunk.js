(this.webpackJsonpcipher=this.webpackJsonpcipher||[]).push([[0],{17:function(e,t,n){},18:function(e,t,n){"use strict";n.r(t);var r=n(3),a=n.n(r),c=n(9),s=n.n(c),i=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,19)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,c=t.getLCP,s=t.getTTFB;n(e),r(e),a(e),c(e),s(e)}))},o=n(4),u=n.p+"static/media/logo.6ce24c58.svg",l=n(10),p=n(1),d=n.n(p),b=n(2),f=n(7),j=function(e){console.log(e),alert("Operation failed! Please try again...")},h={CHUNK_SIZE:52428800,PADDING:16,IV_SIZE:12,ALGO:"AES-GCM",KEY_ALGO:"PBKDF2",KEY_HASH:"SHA-256",KEY_LEN:128,KEY_ITER:1e3},v=function(){var e=Object(b.a)(d.a.mark((function e(t){var n,r,a,c;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=function(e){return window.crypto.subtle.deriveKey({name:h.KEY_ALGO,salt:(new TextEncoder).encode("salt"),iterations:h.KEY_ITER,hash:h.KEY_HASH},e,{name:h.ALGO,length:h.KEY_LEN},!0,["encrypt","decrypt"])},e.next=4,window.crypto.subtle.importKey("raw",(new TextEncoder).encode(t),{name:h.KEY_ALGO},!1,["deriveKey"]);case 4:return r=e.sent,a=n(r),e.abrupt("return",a);case 9:e.prev=9,e.t0=e.catch(0),c=e.t0.message,j(c);case 13:case 14:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(t){return e.apply(this,arguments)}}(),x=function(e){try{var t=Math.floor(h.IV_SIZE/e.length),n=(0===t?e:e.repeat(t+1)).substring(0,h.IV_SIZE),r=(new TextEncoder).encode(n);return{name:h.ALGO,iv:r}}catch(c){var a=c.message;j(a)}},y=new FileReader,O=function(e,t,n){return new Promise((function(r,a){try{var c=e.slice(t,n);y.readAsArrayBuffer(c),y.onloadend=function(e){if(e.target&&e.target.readyState===FileReader.DONE){var t=e.target.result,n=new Uint8Array(t);r(n)}}}catch(i){var s=i.message;j(s)}}))},g=function(e,t){try{if(e>t){var n=t+h.CHUNK_SIZE;return[!0,t,t=e>n?n:e]}return[!1,void 0,void 0]}catch(a){var r=a.message;return j(r),[!1,void 0,void 0]}},m=function(){var e=Object(b.a)(d.a.mark((function e(t,n,r){var a,c,s;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,window.crypto.subtle.encrypt(r,n,t);case 3:return a=e.sent,c=new Uint8Array(a),e.abrupt("return",c);case 8:e.prev=8,e.t0=e.catch(0),s=e.t0.message,j(s);case 12:case 13:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(t,n,r){return e.apply(this,arguments)}}(),w=function(){var e=Object(b.a)(d.a.mark((function e(t,n,r,a,c,s){var i,u,l,p,b,f,h,v,x;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,O(a,c,s);case 3:return i=e.sent,e.next=6,m(i,n,r);case 6:(u=e.sent)&&(t.write(u),l=a.size+1,p=g(l,s),b=Object(o.a)(p,3),f=b[0],h=b[1],v=b[2],f?w(t,n,r,a,h,v):t.close()),e.next=15;break;case 11:e.prev=11,e.t0=e.catch(0),x=e.t0.message,j(x);case 15:case 16:case"end":return e.stop()}}),e,null,[[0,11]])})));return function(t,n,r,a,c,s){return e.apply(this,arguments)}}(),k=function(){var e=Object(b.a)(d.a.mark((function e(t,n,r){var a,c,s,i,o,u,p,b,y,O;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,v(r);case 3:if(a=e.sent,c=x(r),!a||!c){e.next=16;break}return s=Math.random().toString(36).substring(2),i=Object(f.createWriteStream)(s),o=i.getWriter(),u=(new TextEncoder).encode(n),e.next=12,m(u,a,c);case 12:(p=e.sent)?(b=p.length+1,y=new Uint8Array([b].concat(Object(l.a)(p))),o.write(y),0,w(o,a,c,t,0,h.CHUNK_SIZE)):j("Filename encryption failed!"),e.next=17;break;case 16:j("Key generation failed!");case 17:e.next=23;break;case 19:e.prev=19,e.t0=e.catch(0),O=e.t0.message,j(O);case 23:case 24:case"end":return e.stop()}}),e,null,[[0,19]])})));return function(t,n,r){return e.apply(this,arguments)}}(),E=function(){var e=Object(b.a)(d.a.mark((function e(t,n,r){var a,c,s;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,window.crypto.subtle.decrypt(r,n,t);case 3:return a=e.sent,c=new Uint8Array(a),e.abrupt("return",c);case 8:e.prev=8,e.t0=e.catch(0),s=e.t0.message,j(s);case 12:case 13:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(t,n,r){return e.apply(this,arguments)}}(),S=function(){var e=Object(b.a)(d.a.mark((function e(t,n,r,a,c,s){var i,u,l,p,b,f,v,x,y,m;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,O(a,c,s);case 3:return i=e.sent,e.next=6,E(i,n,r);case 6:(u=e.sent)&&(t.write(u),l=a.size+1,p=g(l,s),b=Object(o.a)(p,3),f=b[0],v=b[1],x=b[2],y=x+h.PADDING,f?S(t,n,r,a,v,y):t.close()),e.next=15;break;case 11:e.prev=11,e.t0=e.catch(0),m=e.t0.message,j(m);case 15:case 16:case"end":return e.stop()}}),e,null,[[0,11]])})));return function(t,n,r,a,c,s){return e.apply(this,arguments)}}(),A=function(){var e=Object(b.a)(d.a.mark((function e(t,n){var r,a,c,s,i,o,u,l,p;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,v(n);case 3:if(r=e.sent,a=x(n),!r||!a){e.next=19;break}return e.next=8,O(t,0,1);case 8:return c=e.sent[0],e.next=11,O(t,1,c);case 11:return s=e.sent,e.next=14,E(s,r,a);case 14:(i=e.sent)&&(o=(new TextDecoder).decode(i),u=Object(f.createWriteStream)(o),l=u.getWriter(),S(l,r,a,t,c,c+h.CHUNK_SIZE+h.PADDING)),e.next=20;break;case 19:j("Key generation failed!");case 20:e.next=26;break;case 22:e.prev=22,e.t0=e.catch(0),p=e.t0.message,j(p);case 26:case 27:case"end":return e.stop()}}),e,null,[[0,22]])})));return function(t,n){return e.apply(this,arguments)}}(),I=n(0),K=function(){var e=Object(r.useState)(""),t=Object(o.a)(e,2),n=t[0],a=t[1],c=Object(r.useState)("Choose A File"),s=Object(o.a)(c,2),i=s[0],l=s[1],p=Object(r.useState)(""),d=Object(o.a)(p,2),b=d[0],f=d[1];return Object(I.jsxs)(I.Fragment,{children:[Object(I.jsx)("img",{src:u,className:"logo",alt:"logo"}),Object(I.jsx)("h1",{children:" Cipher "}),Object(I.jsx)("div",{className:"division",children:Object(I.jsx)("hr",{})}),Object(I.jsx)("br",{}),Object(I.jsx)("br",{}),Object(I.jsx)("br",{}),Object(I.jsxs)("div",{className:"main",children:[Object(I.jsxs)("form",{onSubmit:function(e){return e.preventDefault()},children:[Object(I.jsxs)("div",{children:[Object(I.jsxs)("label",{htmlFor:"file",id:"file-label",tabIndex:0,onKeyPress:function(e){var t;" "!==e.key&&"Enter"!==e.key||null===(t=document.getElementById("file"))||void 0===t||t.click()},children:[""===n?"Choose a File":"".concat(i.substring(0,30)).concat(i.length>30?"...":""),Object(I.jsx)("input",{type:"file",id:"file",name:"file",onChange:function(e){var t;(null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.files[0])&&(a(e.target.files[0]),l(e.target.files[0].name))}})]}),Object(I.jsx)("br",{}),Object(I.jsx)("br",{}),Object(I.jsx)("br",{}),Object(I.jsxs)("label",{id:"passkey-label",htmlFor:"key",children:["Passkey :",Object(I.jsx)("input",{type:"text",id:"key",name:"key",onChange:function(e){f(e.target.value)},placeholder:b})]})]}),Object(I.jsx)("input",{type:"button",value:"Encrypt",onClick:function(){""!==n&&""!==b?k(n,i,b):alert("Please provide a file and a passkey in order to encrypt!")}}),Object(I.jsx)("input",{type:"button",value:"Decrypt",onClick:function(){""!==n&&""!==b?A(n,b):alert("Please provide a file and a passkey in order to decrypt!")}})]}),Object(I.jsxs)("div",{className:"instructions",children:[Object(I.jsx)("h2",{children:"Instructions:"}),Object(I.jsxs)("ol",{children:[Object(I.jsx)("li",{children:"Select a file."}),Object(I.jsx)("li",{children:"Write any passkey to encrypt/decrypt the file against."}),Object(I.jsx)("li",{children:"Encrypt or Decrypt your file. It's that easy!"})]}),Object(I.jsx)("p",{children:"Note: Only the passkey used to encrypt a file can be used to decrypt the same."})]}),Object(I.jsx)("br",{}),"No copyrights \ud83d\ude09"]})]})},N=function(){return Object(I.jsx)("div",{className:"App",children:Object(I.jsx)(K,{})})};n(17);s.a.render(Object(I.jsx)(a.a.StrictMode,{children:Object(I.jsx)(N,{})}),document.getElementById("root")),i()}},[[18,1,2]]]);