(()=>{var e={};e.id=92,e.ids=[92],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},9491:e=>{"use strict";e.exports=require("assert")},2361:e=>{"use strict";e.exports=require("events")},7147:e=>{"use strict";e.exports=require("fs")},3685:e=>{"use strict";e.exports=require("http")},5687:e=>{"use strict";e.exports=require("https")},2037:e=>{"use strict";e.exports=require("os")},1017:e=>{"use strict";e.exports=require("path")},2781:e=>{"use strict";e.exports=require("stream")},6224:e=>{"use strict";e.exports=require("tty")},7310:e=>{"use strict";e.exports=require("url")},3837:e=>{"use strict";e.exports=require("util")},9796:e=>{"use strict";e.exports=require("zlib")},6713:(e,s,a)=>{"use strict";a.r(s),a.d(s,{GlobalError:()=>l.a,__next_app__:()=>h,originalPathname:()=>m,pages:()=>c,routeModule:()=>u,tree:()=>d}),a(6139),a(1506),a(5866);var t=a(3191),n=a(8716),i=a(7922),l=a.n(i),r=a(5231),o={};for(let e in r)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>r[e]);a.d(s,o);let d=["",{children:["Dashboard",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,6139)),"D:\\mayank\\openPhone\\frontend\\app\\Dashboard\\page.tsx"]}]},{metadata:{icon:[async e=>(await Promise.resolve().then(a.bind(a,7481))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(a.bind(a,1506)),"D:\\mayank\\openPhone\\frontend\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(a.t.bind(a,5866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(a.bind(a,7481))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],c=["D:\\mayank\\openPhone\\frontend\\app\\Dashboard\\page.tsx"],m="/Dashboard/page",h={require:a,loadChunk:()=>Promise.resolve()},u=new t.AppPageRouteModule({definition:{kind:n.x.APP_PAGE,page:"/Dashboard/page",pathname:"/Dashboard",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},4319:(e,s,a)=>{Promise.resolve().then(a.bind(a,9388))},7225:(e,s,a)=>{Promise.resolve().then(a.t.bind(a,2994,23)),Promise.resolve().then(a.t.bind(a,6114,23)),Promise.resolve().then(a.t.bind(a,9727,23)),Promise.resolve().then(a.t.bind(a,9671,23)),Promise.resolve().then(a.t.bind(a,1868,23)),Promise.resolve().then(a.t.bind(a,4759,23))},8419:()=>{},9388:(e,s,a)=>{"use strict";a.r(s),a.d(s,{default:()=>c});var t=a(326),n=a(7577),i=a(8451),l=a(77);a(9973),a(5378);var r=a(4099),o=a(5047);a(6427);let d=({results:e,onSelect:s})=>t.jsx("div",{className:"results-list",children:e.map((e,a)=>t.jsx("div",{className:"result-item",onClick:()=>s(e),children:e.fullAddress},a))}),c=()=>{let[e,s]=(0,n.useState)(!0),[a,c]=(0,n.useState)(!0),[m,h]=(0,n.useState)(!0),[u,p]=(0,n.useState)(!1),[x,v]=(0,n.useState)(!1),[g,j]=(0,n.useState)([]),[b,N]=(0,n.useState)("Search Address"),[f,y]=(0,n.useState)([]),[k,_]=(0,n.useState)([]),[w,S]=(0,n.useState)(""),[D,C]=(0,n.useState)(""),[P,A]=(0,n.useState)(""),[E,R]=(0,n.useState)([]),[q,M]=(0,n.useState)(null),[$,F]=(0,n.useState)(!1),[I,O]=(0,n.useState)(!0),[Z,T]=(0,n.useState)(0),[L,G]=(0,n.useState)(0),[U,z]=(0,n.useState)(0),[J,B]=(0,n.useState)(0),[K,W]=(0,n.useState)(""),[X,Y]=(0,n.useState)([]),[H,Q]=(0,n.useState)(!1),[V,ee]=(0,n.useState)([]),[es,ea]=(0,n.useState)(!0),[et,en]=(0,n.useState)(!1);(0,n.useRef)(null);let[ei,el]=(0,n.useState)(!0),[er,eo]=(0,n.useState)(!0),[ed,ec]=(0,n.useState)([]),[em,eh]=(0,n.useState)(null),[eu,ep]=(0,n.useState)(1),[ex,ev]=(0,n.useState)([]),[eg,ej]=(0,n.useState)([]),[eb,eN]=(0,n.useState)(new Map),[ef,ey]=(0,n.useState)({messageDelivered:0,messageResponse:0,call:0,callResponse:0}),[ek,e_]=(0,n.useState)(!0),[ew,eS]=(0,n.useState)([]),[eD,eC]=(0,n.useState)("default"),[eP,eA]=(0,n.useState)("all"),[eE,eR]=(0,n.useState)(!0),[eq,eM]=(0,n.useState)("all"),[e$,eF]=(0,n.useState)(""),[eI,eO]=(0,n.useState)(""),[eZ,eT]=(0,n.useState)(!1),[eL,eG]=(0,n.useState)(new Set),[eU,ez]=(0,n.useState)("");(0,n.useEffect)(()=>{let e=localStorage.getItem("pinnedConversations");e&&eG(new Set(JSON.parse(e)))},[]);let[eJ,eB]=(0,n.useState)(new Set),[eK,eW]=(0,n.useState)([]),eX=e=>{eS(s=>s.includes(e)?s.filter(s=>s!==e):[...s,e])},eY=e=>{let s=new Date(e),a=new Date;return a.setDate(a.getDate()-7),s>=a},eH=e=>{let s=new Date(e),a=new Date;return a.setMonth(a.getMonth()-1),s>=a},eQ=V.filter(e=>{let s=0===ew.length||ew.includes(e.auction_event_id),a="all"===eD||"bookmarked"===eD&&e.is_bookmarked||"default"===eD,t="all"===eq||"weekly"===eq&&eY(e.created_at)||"monthly"===eq&&eH(e.created_at),n=(!e$||new Date(e.created_at)>=new Date(e$))&&(!eI||new Date(e.created_at)<=new Date(eI)),i=e.displayAddress.toLowerCase().includes(eU.toLowerCase());return s&&a&&t&&n&&i}),eV=eQ.length>0?eQ:V,e0=()=>{en(e=>!e)},e1=(0,o.useRouter)();(0,n.useEffect)(()=>{localStorage.getItem("authToken")||e1.push("/")},[e1]),(0,n.useEffect)(()=>{(async()=>{try{let e=(await r.Z.get("http://localhost:8000/address/getalladdress")).data.map(e=>({id:e.id,displayAddress:e.address,is_bookmarked:e.is_bookmarked,auction_event_id:e.auction_event_id,created_at:e.created_at,notificationCount:0,address:e.address})),s=(await r.Z.get("http://localhost:8000/notifications")).data.filter(e=>!e.is_read);ev(s);let a=e.map(e=>{let a=s.filter(s=>s.address_id===e.id).length;return{...e,notificationCount:a}});ee(a),a.length>0&&(N(a[0].displayAddress),eh(a[0].id))}catch(e){console.error("Error fetching data:",e)}})()},[]),(0,n.useEffect)(()=>{(async()=>{try{let e=await fetch("http://localhost:8000/openPhoneEventData/all");if(!e.ok)throw Error("Failed to fetch event counts");let s=await e.json();ey(s)}catch(e){}finally{e_(!1)}})()},[]);let e2=e=>{let s=V.find(s=>s.id===e);if(!s)return;let a=!s.is_bookmarked;console.log(`Toggling bookmark status for address ID ${e} to ${a}`),r.Z.post(`http://localhost:8000/bookmarks/${e}`,{is_bookmarked:a}).then(s=>{ee(s=>s.map(s=>s.id===e?{...s,is_bookmarked:a}:s))}).catch(e=>{console.error("Error updating bookmark status:",e)})},e7=async e=>{try{let s=eL.has(e),a=await r.Z.post(`http://localhost:8000/openPhoneEventData/toggle-number-pin/${e}`);200===a.status||201===a.status?eG(a=>{let t=new Set(a);return s?t.delete(e):t.add(e),localStorage.setItem("pinnedConversations",JSON.stringify([...t])),t}):console.error("API response not OK:",a.status,a.data)}catch(e){console.error("Error toggling the pin:",e)}};(0,n.useEffect)(()=>{b&&"Search Address"!==b&&r.Z.get(`http://localhost:8000/openPhoneEventData/events?address=${encodeURIComponent(b)}`).then(e=>{let s=e.data.data;if(s&&Array.isArray(s.events)){_(s.events);let e=s.events.filter(e=>e.address_id);ej(Array.from(new Set(e.map(e=>e.from)))),e.length>0?(S(e[0].to),C(e[0].from)):(S(""),C("")),T(s.messageDelivered||0),G(s.messageResponse||0),z(s.call||0),B(s.callResponse||0)}else console.error("Events data is not an array or is missing")}).catch(e=>{console.error("Error fetching event data:",e)})},[b]);let e9=e=>{eN(s=>{let a=new Map(s);return a.has(e)?a.delete(e):a.set(e,!0),a})},e8=k.filter(e=>g.includes("delivered")&&g.includes("received")?2===e.event_type_id||1===e.event_type_id:g.includes("delivered")?2===e.event_type_id:!g.includes("received")||1===e.event_type_id).filter(e=>null!==e.address_id&&void 0!==e.address_id).map(e=>({ownerid:e.conversation_id,PhoneNumber:e.to,Status:e.is_stop?"Inactive":"Active",Responses:e.is_stop?"Stop":"Interested"})),e3=6*eu;e8.slice(e3-6,e3),e8.length;let e6=(e,s)=>{N(e),eh(s),_([])};(0,n.useEffect)(()=>{let e=setTimeout(async()=>{(async function(){try{let e=await r.Z.get("http://localhost:8000/openPhoneEventData/events-by-address-and-from",{params:{address_id:em,from_number:D}});ec(e.data.data)}catch(e){}finally{}})()},700);return()=>clearTimeout(e)},[em,D]);let e5=ed.reduce((e,s)=>(e[s.conversation_id]||(e[s.conversation_id]=[]),e[s.conversation_id].push(s),e),{}),e4=e=>{eC(e)},[se,ss]=(0,n.useState)(e5);console.log("\uD83D\uDE80 ~ Dashboard ~ updatedMessages:",se),(0,n.useEffect)(()=>{ss(e5)},[ed,e5]);let sa=async(e,s)=>{try{await r.Z.post(`http://localhost:8000/openPhoneEventData/toggle-message-pin/${e}`),ss(a=>{let t={...a},n=t[s].map(s=>s.id===e?{...s,is_message_pinned:!s.is_message_pinned}:s);return t[s]=n,t})}catch(e){console.error("Failed to toggle pin state:",e)}};return(0,t.jsxs)("div",{children:[t.jsx(i.Z,{toggleSidebar:()=>{O(e=>!e)},onSelectAddress:e=>{N(e.fullAddress)}}),I&&t.jsx(l.Z,{}),(0,t.jsxs)("div",{className:"main-container",children:[(0,t.jsxs)("div",{className:"content-with-border-right",children:[t.jsx("div",{className:"openphone",children:t.jsx("span",{className:"border-bottom pb-3",children:"OpenPhone"})}),(0,t.jsxs)("div",{className:"",children:[t.jsx("div",{className:"information",children:"Message and Calls"}),t.jsx("div",{className:"main-dropdown",children:(0,t.jsxs)("div",{className:"status",children:["Status",(0,t.jsxs)("span",{className:"ms-2 mb-2 ",children:[t.jsx("button",{className:"btn",type:"button",onClick:()=>{ea(e=>!e)},"aria-expanded":et,children:t.jsx("img",{src:"/dropdownicon.svg",alt:"Dropdown Icon"})}),(0,t.jsxs)("ul",{className:`dropdown-type ${et?"show":""}`,children:[(0,t.jsxs)("li",{className:"dropdown-item",children:[t.jsx("input",{type:"checkbox"}),t.jsx("label",{className:"ms-2",children:"Delivered"})]}),(0,t.jsxs)("li",{className:"dropdown-item pt-2",children:[t.jsx("input",{type:"checkbox",id:"notDelivered"}),t.jsx("label",{className:"ms-2",htmlFor:"notDelivered",children:"Received"})]})]})]})]})}),(0,t.jsxs)("div",{className:"type",children:["Type",(0,t.jsxs)("span",{className:"ms-2 mb-2 ",children:[t.jsx("button",{className:"btn",type:"button",onClick:e0,"aria-expanded":et,children:t.jsx("img",{src:"/dropdownicon.svg",alt:"Dropdown Icon"})}),(0,t.jsxs)("ul",{className:`dropdown-type ${et?"show":""}`,children:[(0,t.jsxs)("li",{className:"dropdown-item",children:[t.jsx("input",{type:"checkbox",className:"checkbox",id:"case",onChange:()=>eX(3)}),t.jsx("label",{className:"ms-2",children:"Case"})]}),(0,t.jsxs)("li",{className:"dropdown-item pt-2",children:[t.jsx("input",{type:"checkbox",className:"checkbox",id:"auction",onChange:()=>eX(1)}),t.jsx("label",{className:"ms-2",htmlFor:"auction",children:"Auction"})]}),(0,t.jsxs)("li",{className:"dropdown-item pt-2",children:[t.jsx("input",{type:"checkbox",className:"checkbox",id:"taxDeed",onChange:()=>eX(2)}),t.jsx("label",{className:"ms-2",htmlFor:"taxDeed",children:"Tax deed"})]})]})]})]}),(0,t.jsxs)("div",{className:"Date",children:["Date",(0,t.jsxs)("span",{className:"ms-2 mb-2",children:[t.jsx("button",{className:"btn",type:"button",onClick:e0,"aria-expanded":et,children:t.jsx("img",{src:"/dropdownicon.svg",alt:"Dropdown Icon"})}),(0,t.jsxs)("ul",{className:`dropdown-Date ${et?"show":""}`,children:[(0,t.jsxs)("li",{className:"dropdown-item",children:[t.jsx("input",{type:"checkbox",id:"weekly",className:"checkbox",onChange:()=>eM("weekly"===eq?"all":"weekly")}),(0,t.jsxs)("label",{className:"ms-2",htmlFor:"weekly",children:["Weekly"," "]})]}),(0,t.jsxs)("li",{className:"dropdown-item pt-2",children:[t.jsx("input",{type:"checkbox",id:"monthly",className:"checkbox",onChange:()=>eM("monthly"===eq?"all":"monthly")}),(0,t.jsxs)("label",{className:"ms-2",htmlFor:"monthly",children:["Monthly"," "]})]}),t.jsx("div",{className:"custom",children:(0,t.jsxs)("li",{className:"dropdown-item pt-2",children:[(0,t.jsxs)("label",{className:"custom",htmlFor:"pending",children:["custom",t.jsx("button",{className:"btn ms-2",type:"button",onClick:()=>{eo(!er)},"aria-expanded":er,children:t.jsx("img",{src:"/dropdownicon.svg",alt:"Dropdown Icon"})})]}),er&&(0,t.jsxs)("div",{className:"custom-date-dropdown borderless",children:[(0,t.jsxs)("div",{className:"d-flex align-items-center",children:[t.jsx("label",{htmlFor:"fromDate",className:"me-2",children:"From:"}),t.jsx("input",{type:"date",id:"fromDate",className:"set-date  me-2",value:e$,onChange:e=>eF(e.target.value)})]}),(0,t.jsxs)("div",{className:"d-flex align-items-center mt-2",children:[t.jsx("label",{htmlFor:"toDate",className:"me-2",children:"To:"}),t.jsx("input",{type:"date",id:"toDate",className:"set-date me-2 todate",value:eI,onChange:e=>eO(e.target.value)})]}),t.jsx("div",{className:"d-flex align-items-center mt-2 gap-2",children:t.jsx("button",{className:"btn btn-primary btn btn-primary reset-button",type:"button",onClick:()=>{eF(""),eO(""),eo(!0)},children:"Reset"})})]})]})})]})]})]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"heading",children:[t.jsx("img",{src:"/Done.svg",alt:""})," Comprehensive view of Address"]}),(0,t.jsxs)("div",{className:"logos-row-msg1",children:[(0,t.jsxs)("div",{className:"nav-msg1",children:[t.jsx("div",{className:"message1",children:"Message Delivered"}),t.jsx("input",{type:"text",className:"round-input1",value:ef.messageDelivered,readOnly:!0})]}),(0,t.jsxs)("div",{className:"nav-msg1",children:[t.jsx("div",{className:"message1 response ",children:"Message Response"}),t.jsx("input",{type:"text",className:"round-input1",value:ef.messageResponse,readOnly:!0})]}),(0,t.jsxs)("div",{className:"nav-msg1",children:[t.jsx("div",{className:"message1 call-",children:"Call "}),t.jsx("input",{type:"text",className:"round-input1",value:ef.call,readOnly:!0})]}),(0,t.jsxs)("div",{className:"nav-msg1",children:[t.jsx("div",{className:"message1 call-response",children:"Call Response"}),t.jsx("input",{type:"text",className:"round-input1",value:ef.callResponse,readOnly:!0})]})]})]}),(0,t.jsxs)("div",{className:"main-Address ",children:[(0,t.jsxs)("span",{className:"",children:[" ",t.jsx("img",{src:"/User.svg",alt:"users",className:"person-icon ms-4"})]}),t.jsx("div",{className:"Address ms-4",children:"Address"}),(0,t.jsxs)("div",{className:"main-search",children:[(0,t.jsxs)("div",{className:"search-box ",children:[t.jsx("span",{className:"icon",children:t.jsx("img",{src:"/Icon.svg",alt:"icon"})}),t.jsx("input",{type:"text",placeholder:"Search Address",value:eU,onChange:e=>{ez(e.target.value)}})]}),(0,t.jsxs)("div",{className:"icon-labels",children:[(0,t.jsxs)("div",{className:`bookmark-container text-center ${"bookmarked"===eD?"active-filter":""}`,onClick:()=>e4("bookmarked"),children:[t.jsx("i",{className:"bi bi-bookmark ms-4"}),t.jsx("div",{className:"ms-4",children:"Select all"})]}),(0,t.jsxs)("div",{className:"redo-container text-center",onClick:()=>{eC("all")},children:[t.jsx("img",{src:"/redo.svg",alt:"redo",className:"ms-3"}),t.jsx("div",{children:"Default"})]})]}),t.jsx("div",{children:(0,t.jsxs)("div",{className:"address-list",children:[t.jsx("div",{className:"search-wrapper-add",children:X.length>0&&t.jsx(d,{results:X,onSelect:e=>{W(e.fullAddress),Y([])}})}),eV.length>0?eV.map(e=>t.jsx("li",{className:`list-group-item justify-content-between ${em===e.id?"selected-address":""}`,onClick:()=>e6(e.displayAddress,e.id),children:(0,t.jsxs)("div",{className:"setaddress d-flex align-items-center gap-3 ",children:[t.jsx("i",{className:`bi ${e.is_bookmarked?"bi-bookmark-fill":"bi-bookmark"} clickable-icon`,style:{cursor:"pointer",color:e.is_bookmarked?"blue":"grey"},onClick:()=>e2(e.id)}),(0,t.jsxs)("span",{className:"ml-2",children:[e.displayAddress,e.notificationCount>0&&(0,t.jsxs)("span",{className:"notification-count ml-2",children:["(",e.notificationCount,")"]})]})]})},e.id)):t.jsx("p",{children:"No addresses found."})]})})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"Analyticdata ",children:[t.jsx("span",{children:t.jsx("i",{className:"bi bi-bar-chart-line-fill"})}),t.jsx("span",{className:"ms-4",children:"Analytic Data of Selected Address"})]}),t.jsx("div",{className:" main-message",children:(0,t.jsxs)("div",{className:"logos-row-msg",children:[(0,t.jsxs)("div",{className:"nav-msg",children:[t.jsx("div",{className:"message Delivered",children:"Message Delivered"}),t.jsx("input",{type:"text",className:"round-input",value:Z,readOnly:!0})]}),(0,t.jsxs)("div",{className:"nav-msg",children:[t.jsx("div",{className:"message response1 ",children:"Message Response"}),t.jsx("input",{type:"text",className:"round-input",value:L,readOnly:!0})]}),(0,t.jsxs)("div",{className:"nav-msg",children:[t.jsx("div",{className:"message call-1",children:"Call "}),t.jsx("input",{type:"text",className:"round-input",value:U,readOnly:!0})]}),(0,t.jsxs)("div",{className:"nav-msg",children:[t.jsx("div",{className:"message call-response-1",children:"Call Response"}),t.jsx("input",{type:"text",className:"round-input",value:J,readOnly:!0})]})]})})]}),(0,t.jsxs)("div",{className:"conversation",children:[b&&(0,t.jsxs)("div",{className:"conversation-chat",children:[t.jsx("img",{src:"converstation.svg",alt:""})," Conversation From ",eg.length>0&&t.jsx("select",{value:D,onChange:e=>C(e.target.value),children:eg.map((e,s)=>t.jsx("option",{value:e,children:e},s))})]}),t.jsx("div",{className:"search-wrapper ",children:t.jsx("input",{className:"search",type:"search",placeholder:"Search To"})}),t.jsx("div",{className:"input-msg",children:t.jsx("div",{className:"screenshot-msg",children:t.jsx("div",{className:"inbox-chat",children:ed.length>0?Object.keys(se).map(e=>{let s=se[e].some(e=>e.is_stop);return console.log("\uD83D\uDE80 ~ Dashboard ~ isStop:",se,s),(0,t.jsxs)("div",{children:[t.jsx("div",{className:"to-line",children:"."}),(0,t.jsxs)("div",{className:"to-value",children:[t.jsx("strong",{children:"To "}),t.jsx("span",{style:{color:s?"red":"inherit"},children:se[e][0].to}),t.jsx("i",{className:`bi pinnumber ${eL.has(e)?"bi-pin-fill text-primary":"bi-pin"}`,onClick:()=>e7(e)})]}),se[e].map((s,a)=>(0,t.jsxs)("div",{children:[t.jsx("div",{className:1===s.event_type_id?"chat-message-right":"chat-message-left",children:t.jsx("div",{className:"message-body-1",children:eb.has(a)?(0,t.jsxs)("div",{children:[s.body,t.jsx("button",{onClick:()=>e9(a),className:`read-less-btn ${1===s.event_type_id?"read-less-btn-right":"read-less-btn-left"}`,children:"Read Less"}),t.jsx("i",{className:`bi ${s.is_message_pinned?"bi-star-fill text-warning":"bi-star"} star-icon`,onClick:()=>sa(s.id,e)})]}):t.jsx("div",{children:s.body&&s.body.length>100?(0,t.jsxs)(t.Fragment,{children:[s.body.substring(0,100),"...",t.jsx("button",{onClick:()=>e9(a),className:`read-more-btn ${1===s.event_type_id?"read-more-btn-right":"read-more-btn-left"}`,children:"Read More"}),t.jsx("i",{style:{cursor:"pointer"},className:`bi ${s.is_message_pinned?"bi-star-fill text-warning":"bi-star"} star-icon cursor-pointer`,onClick:()=>sa(s.id,e)})]}):(0,t.jsxs)(t.Fragment,{children:[s.body," ",t.jsx("i",{className:`bi ${s.is_message_pinned?"bi-star-fill text-warning":"bi-star"} star-icon`,onClick:()=>sa(s.id,e)})]})||"No message body"})})}),t.jsx("div",{className:1===s.event_type_id?"message-date message-date-right":"message-date message-date-left",children:new Date(s.created_at).toLocaleDateString()})]},a))]},e)}):"Loading..."})})})]})]})]})}},8451:(e,s,a)=>{"use strict";a.d(s,{Z:()=>d});var t=a(326),n=a(7577),i=a(6226),l=a(8201),r=a(4099);a(9135),a(5996);let o=({event:e,is_read:s,event_id:a,handleMarkAsRead:i})=>{let[l,r]=(0,n.useState)(!1);return t.jsx("li",{className:s?"":"new-notification",children:(0,t.jsxs)("div",{children:[t.jsx("span",{children:t.jsx("i",{className:"bi bi-chat-right-text icon-message icon-missed"})}),t.jsx("span",{className:"missed-message",children:"You have missed message from"}),t.jsx("div",{className:"event-from",children:e.from}),(0,t.jsxs)("div",{className:"message-body",children:["Message:",l||!e.body||e.body.length<=18?e.body||"No content available":`${e.body.slice(0,18)}.. `,e.body&&e.body.length>18&&t.jsx("button",{onClick:()=>{r(!l)},className:"read-more-btn text-success",children:l?"..Read Less":"Read More"}),t.jsx("div",{children:!s&&t.jsx("button",{onClick:()=>i(a),className:"notification-info",children:"Mark as Read"})})]})]})},a)},d=({toggleSidebar:e,setResults:s,onSelectAddress:a})=>{let[d,c]=(0,n.useState)(""),[m,h]=(0,n.useState)(""),[u,p]=(0,n.useState)([]),[x,v]=(0,n.useState)([]),[g,j]=(0,n.useState)(!1);(0,n.useEffect)(()=>{let e=localStorage.getItem("authToken");if(e)try{let s=(0,l.o)(e);c(s.name)}catch(e){console.error("Failed to decode token:",e)}},[]),(0,n.useEffect)(()=>{(async()=>{try{let e=await r.Z.get("http://localhost:8000/notifications");v(e.data.filter(e=>!e.is_read))}catch(e){console.error("Error fetching notifications:",e),v([])}})()},[]);let b=async e=>{try{let s=await r.Z.post(`http://localhost:8000/notifications/${e}/read`);console.log("Backend Response:",s),200===s.status||201===s.status?v(s=>s.filter(s=>s.event_id!==e)):console.error("Failed to mark notification as read:",s)}catch(e){console.error("Error marking notification as read:",e)}},N=x.length;return t.jsx("nav",{className:"navbar",children:(0,t.jsxs)("div",{className:"container-fluid",children:[t.jsx(i.default,{src:"/line.svg",alt:"Logo",className:"logo1",width:50,height:50,onClick:e}),(0,t.jsxs)("div",{className:"nav-list",children:[t.jsx("div",{className:"profileicon",children:t.jsx(i.default,{src:"/account_circle.svg",alt:"Profile",className:"profile",width:50,height:50})}),t.jsx("a",{className:"name",children:d||"User"}),(0,t.jsxs)("div",{className:"bellicon",onClick:()=>{j(!g)},children:[t.jsx(i.default,{src:"/bell.svg",alt:"Notifications",className:"bell",width:50,height:50}),N>0&&t.jsx("span",{className:"new-notification-dot",children:N})]}),g&&(0,t.jsxs)("div",{className:"notification-dropdown",children:[(0,t.jsxs)("div",{className:"main-notification",children:[(0,t.jsxs)("span",{children:[t.jsx("i",{className:"bi bi-telephone-inbound-fill call-icon"})," Calls"]}),(0,t.jsxs)("span",{className:"text-danger",children:[" ",t.jsx("i",{className:"bi bi-chat-right-text icon-message"})," Message "]})]}),t.jsx("div",{className:"border-bottom mt-2"}),t.jsx("ul",{children:x.map(e=>t.jsx(o,{event:e.event,is_read:e.is_read,event_id:e.event_id,handleMarkAsRead:b,id:0,address_id:null,created_at:""},e.event_id))})]})]})]})})}},77:(e,s,a)=>{"use strict";a.d(s,{Z:()=>r});var t=a(326);a(7577);var n=a(6226),i=a(434),l=a(5047);a(9667),a(9949);let r=()=>{let e=(0,l.useRouter)();return t.jsx(t.Fragment,{children:(0,t.jsxs)("ul",{className:"sidebar",children:[t.jsx("div",{children:(0,t.jsxs)("li",{className:"nav",children:[(0,t.jsxs)(i.default,{href:"/Dashboard",children:[t.jsx(n.default,{src:"/upicon.svg",alt:"Logo",className:"logo2",width:50,height:50}),t.jsx("p",{className:"dash",children:"Dashboard"})]})," "]})}),t.jsx("div",{children:t.jsx("li",{className:"nav",children:(0,t.jsxs)(i.default,{href:"/conversationmapping",children:[t.jsx(n.default,{src:"/mapingi.svg",alt:"Logo",className:"logo2",width:50,height:50}),t.jsx("p",{className:"dash",children:"Map Address"})]})})}),t.jsx("div",{className:"log",children:t.jsx("div",{onClick:()=>{localStorage.removeItem("authToken"),e.push("/")},children:"Log out"})})]})})}},6139:(e,s,a)=>{"use strict";a.r(s),a.d(s,{$$typeof:()=>l,__esModule:()=>i,default:()=>r});var t=a(8570);let n=(0,t.createProxy)(String.raw`D:\mayank\openPhone\frontend\app\Dashboard\page.tsx`),{__esModule:i,$$typeof:l}=n;n.default;let r=(0,t.createProxy)(String.raw`D:\mayank\openPhone\frontend\app\Dashboard\page.tsx#default`)},1506:(e,s,a)=>{"use strict";a.r(s),a.d(s,{default:()=>r,metadata:()=>l});var t=a(9510),n=a(7366),i=a.n(n);a(8399),a(7272);let l={title:"openPhone",description:"Generated by create next app"};function r({children:e}){return t.jsx("html",{lang:"en",children:t.jsx("body",{className:i().className,children:e})})}},7481:(e,s,a)=>{"use strict";a.r(s),a.d(s,{default:()=>n});var t=a(6621);let n=e=>[{type:"image/x-icon",sizes:"16x16",url:(0,t.fillMetadataSegment)(".",e.params,"favicon.ico")+""}]},5378:()=>{},9135:()=>{},6427:()=>{},9667:()=>{},7272:()=>{},9973:()=>{}};var s=require("../../webpack-runtime.js");s.C(e);var a=e=>s(s.s=e),t=s.X(0,[948,428,535,600],()=>a(6713));module.exports=t})();