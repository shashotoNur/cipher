(this.webpackJsonpcipher=this.webpackJsonpcipher||[]).push([[0],{17:function(e,t,n){},18:function(e,t,n){"use strict";n.r(t);var r=n(3),a=n.n(r),c=n(9),s=n.n(c),i=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,19)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,c=t.getLCP,s=t.getTTFB;n(e),r(e),a(e),c(e),s(e)}))},o=n(4),u=n.p+"static/media/logo.6ce24c58.svg",l=n(10),p=n(1),d=n.n(p),b=n(2),f=n(7),j=function(e){console.log(e),alert("Operation failed! Please try again...")},h=function(){var e=Object(b.a)(d.a.mark((function e(t){var n,r,a;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,window.crypto.subtle.importKey("raw",(new TextEncoder).encode(t),{name:"PBKDF2"},!1,["deriveKey"]);case 3:return n=e.sent,r=function(e){return window.crypto.subtle.deriveKey({name:"PBKDF2",salt:(new TextEncoder).encode("salt"),iterations:1e3,hash:"SHA-256"},e,{name:"AES-GCM",length:128},!0,["encrypt","decrypt"])}(n),e.abrupt("return",r);case 9:e.prev=9,e.t0=e.catch(0),a=e.t0.message,j(a);case 13:case 14:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(t){return e.apply(this,arguments)}}(),v={CHUNK_SIZE:52428800,PADDING:16,IV_SIZE:12,ALGO:"AES-GCM"},x=function(e){try{var t=Math.floor(v.IV_SIZE/e.length),n=(0===t?e:e.repeat(t+1)).substring(0,v.IV_SIZE),r=(new TextEncoder).encode(n);return{name:v.ALGO,iv:r}}catch(c){var a=c.message;j(a)}},y=new FileReader,O=function(e,t,n){return new Promise((function(r,a){try{var c=e.slice(t,n);y.readAsArrayBuffer(c),y.onloadend=function(e){if(e.target&&e.target.readyState===FileReader.DONE){var t=e.target.result,n=new Uint8Array(t);r(n)}}}catch(i){var s=i.message;j(s)}}))},g=function(e,t){try{var n=e.size+1;if(n>t){var r=t+v.CHUNK_SIZE;return[!0,t,t=n>r?r:n]}return[!1,void 0,void 0]}catch(c){var a=c.message;return j(a),[!1,void 0,void 0]}},m=function(){var e=Object(b.a)(d.a.mark((function e(t,n,r){var a,c,s;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,window.crypto.subtle.encrypt(r,n,t);case 3:return a=e.sent,c=new Uint8Array(a),e.abrupt("return",c);case 8:e.prev=8,e.t0=e.catch(0),s=e.t0.message,j(s);case 12:case 13:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(t,n,r){return e.apply(this,arguments)}}(),w=function(){var e=Object(b.a)(d.a.mark((function e(t,n,r,a,c,s){var i,u,l,p,b,f,h,v;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,O(a,c,s);case 3:return i=e.sent,e.next=6,m(i,n,r);case 6:(u=e.sent)&&(t.write(u),l=g(a,s),p=Object(o.a)(l,3),b=p[0],f=p[1],h=p[2],b?w(t,n,r,a,f,h):t.close()),e.next=15;break;case 11:e.prev=11,e.t0=e.catch(0),v=e.t0.message,j(v);case 15:case 16:case"end":return e.stop()}}),e,null,[[0,11]])})));return function(t,n,r,a,c,s){return e.apply(this,arguments)}}(),k=function(){var e=Object(b.a)(d.a.mark((function e(t,n,r){var a,c,s,i,o,u,p,b,y,O;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,h(r);case 3:if(a=e.sent,c=x(r),!a||!c){e.next=16;break}return s=Math.random().toString(36).substring(2),i=Object(f.createWriteStream)(s),o=i.getWriter(),u=(new TextEncoder).encode(n),e.next=12,m(u,a,c);case 12:(p=e.sent)?(b=p.length+1,y=new Uint8Array([b].concat(Object(l.a)(p))),o.write(y),0,w(o,a,c,t,0,v.CHUNK_SIZE)):j("Filename encryption failed!"),e.next=17;break;case 16:j("Key generation failed!");case 17:e.next=23;break;case 19:e.prev=19,e.t0=e.catch(0),O=e.t0.message,j(O);case 23:case 24:case"end":return e.stop()}}),e,null,[[0,19]])})));return function(t,n,r){return e.apply(this,arguments)}}(),S=function(){var e=Object(b.a)(d.a.mark((function e(t,n,r){var a,c,s;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,window.crypto.subtle.decrypt(r,n,t);case 3:return a=e.sent,c=new Uint8Array(a),e.abrupt("return",c);case 8:e.prev=8,e.t0=e.catch(0),s=e.t0.message,j(s);case 12:case 13:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(t,n,r){return e.apply(this,arguments)}}(),E=function(){var e=Object(b.a)(d.a.mark((function e(t,n,r,a,c,s){var i,u,l,p,b,f,h,x,y;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,O(a,c,s);case 3:return i=e.sent,e.next=6,S(i,n,r);case 6:(u=e.sent)&&(t.write(u),l=g(a,s),p=Object(o.a)(l,3),b=p[0],f=p[1],h=p[2],x=h+v.PADDING,b?E(t,n,r,a,f,x):t.close()),e.next=15;break;case 11:e.prev=11,e.t0=e.catch(0),y=e.t0.message,j(y);case 15:case 16:case"end":return e.stop()}}),e,null,[[0,11]])})));return function(t,n,r,a,c,s){return e.apply(this,arguments)}}(),I=function(){var e=Object(b.a)(d.a.mark((function e(t,n){var r,a,c,s,i,o,u,l,p;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,h(n);case 3:if(r=e.sent,a=x(n),!r||!a){e.next=18;break}return e.next=8,O(t,0,1);case 8:return c=e.sent[0],e.next=11,O(t,1,c);case 11:return s=e.sent,e.next=14,S(s,r,a);case 14:(i=e.sent)?(o=(new TextDecoder).decode(i),u=Object(f.createWriteStream)(o),l=u.getWriter(),E(l,r,a,t,c,c+v.CHUNK_SIZE+v.PADDING)):j("Filename decryption failed!"),e.next=19;break;case 18:j("Key generation failed!");case 19:e.next=25;break;case 21:e.prev=21,e.t0=e.catch(0),p=e.t0.message,j(p);case 25:case 26:case"end":return e.stop()}}),e,null,[[0,21]])})));return function(t,n){return e.apply(this,arguments)}}(),A=n(0),C=function(){var e=Object(r.useState)(""),t=Object(o.a)(e,2),n=t[0],a=t[1],c=Object(r.useState)("Choose A File"),s=Object(o.a)(c,2),i=s[0],l=s[1],p=Object(r.useState)(""),d=Object(o.a)(p,2),b=d[0],f=d[1];return Object(A.jsxs)(A.Fragment,{children:[Object(A.jsx)("img",{src:u,className:"logo",alt:"logo"}),Object(A.jsx)("h1",{children:" Cipher "}),Object(A.jsx)("div",{className:"division",children:Object(A.jsx)("hr",{})}),Object(A.jsx)("br",{}),Object(A.jsx)("br",{}),Object(A.jsx)("br",{}),Object(A.jsxs)("div",{className:"main",children:[Object(A.jsxs)("form",{onSubmit:function(e){return e.preventDefault()},children:[Object(A.jsxs)("div",{children:[Object(A.jsxs)("label",{htmlFor:"file",id:"file-label",children:[""===n?"Choose a File":"".concat(i.substring(0,30)).concat(i.length>30?"...":""),Object(A.jsx)("input",{type:"file",id:"file",name:"file",onChange:function(e){var t;(null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.files[0])&&(a(e.target.files[0]),l(e.target.files[0].name))}})]}),Object(A.jsx)("br",{}),Object(A.jsx)("br",{}),Object(A.jsx)("br",{}),Object(A.jsxs)("label",{id:"passkey-label",htmlFor:"key",children:["Passkey :",Object(A.jsx)("input",{type:"text",id:"key",name:"key",onChange:function(e){f(e.target.value)},placeholder:b})]})]}),Object(A.jsx)("input",{type:"button",value:"Encrypt",onClick:function(){""!==n&&""!==b?k(n,i,b):alert("Please provide a file and a passkey in order to encrypt!")}}),Object(A.jsx)("input",{type:"button",value:"Decrypt",onClick:function(){""!==n&&""!==b?I(n,b):alert("Please provide a file and a passkey in order to decrypt!")}})]}),Object(A.jsxs)("div",{className:"instructions",children:[Object(A.jsx)("h2",{children:"Instructions:"}),Object(A.jsxs)("ol",{children:[Object(A.jsx)("li",{children:"Select a file."}),Object(A.jsx)("li",{children:"Write any passkey to encrypt/decrypt the file against."}),Object(A.jsx)("li",{children:"Encrypt or Decrypt your file. It's that easy!"})]}),Object(A.jsx)("p",{children:"Note: Only the passkey used to encrypt a file can be used to decrypt the same."})]}),Object(A.jsx)("br",{}),"No copyrights \ud83d\ude09"]})]})},F=function(){return Object(A.jsx)("div",{className:"App",children:Object(A.jsx)(C,{})})};n(17);s.a.render(Object(A.jsx)(a.a.StrictMode,{children:Object(A.jsx)(F,{})}),document.getElementById("root")),i()}},[[18,1,2]]]);
//# sourceMappingURL=main.9acaf463.chunk.js.map