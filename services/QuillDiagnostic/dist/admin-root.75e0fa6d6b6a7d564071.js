(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{1318:function(e,t,n){"use strict";n.r(t);var i=n(6),a=n.n(i),s=n(293),c=n(447),o=n(47);o.a.child("users");function u(e){return a.a.createElement("li",null,a.a.createElement(s.Link,{activeClassName:"is-active",to:e.to},e.children))}var r=n(308),l=n(306),E=n(167),d=n(254),_=n(1355),N=n(244),p=n(476),m=n(255),I=n(1402),f=n(1403),S=n(1404),C=a.a.createClass({displayName:"adminContainer",componentWillMount:function(){this.props.dispatch(function(e){var t=new FormData;t.append("json",JSON.stringify({app:Object({NODE_ENV:"production",EMPIRICAL_BASE_URL:"https://www.quill.org",QUILL_CMS:"https://cms.quill.org",PUSHER_KEY:"a253169073ce7474f0ce",QUILL_CDN_URL:"https://assets.quill.org"}).FIREBASE_APP_NAME})),fetch("".concat("https://www.quill.org","/api/v1/firebase_tokens/create_for_connect"),{method:"POST",mode:"cors",credentials:"include",body:t}).then(function(e){if(!e.ok)throw Error(e.statusText);return e.json()}).then(function(e){o.b.auth().signInWithCustomToken(e.token).then(function(e){var t=o.b.auth().currentUser;t&&t.getIdToken().then(function(e){})}).catch(function(e){})})}),this.props.dispatch(r.a.startListeningToConcepts()),this.props.dispatch(l.a.startListeningToConceptsFeedback()),this.props.dispatch(E.a.loadQuestions()),this.props.dispatch(d.a.startListeningToQuestions()),this.props.dispatch(_.a.startListeningToDiagnosticQuestions()),this.props.dispatch(N.a.startListeningToSentenceFragments()),this.props.dispatch(p.a.startListeningToItemLevels()),this.props.dispatch(m.c()),this.props.dispatch(I.b()),this.props.dispatch(f.b()),this.props.dispatch(S.b())},render:function(){return a.a.createElement("div",null,a.a.createElement("section",{className:"section is-fullheight",style:{display:"flex",flexDirection:"row",paddingTop:0,paddingBottom:0}},a.a.createElement("aside",{className:"menu",style:{minWidth:220,borderRight:"1px solid #e3e3e3",padding:15,paddingLeft:0}},a.a.createElement("p",{className:"menu-label"},"General"),a.a.createElement("ul",{className:"menu-list"},a.a.createElement(u,{activeClassName:"is-active",to:"/admin/datadash"},"Score analysis"),a.a.createElement(u,{activeClassName:"is-active",to:"/admin/question-health"},"Question Health"),a.a.createElement(u,{activeClassName:"is-active",to:"/admin/lessons"},"Diagnostics")),a.a.createElement("p",{className:"menu-label"},"Questions"),a.a.createElement("ul",{className:"menu-list"},a.a.createElement(u,{activeClassName:"is-active",to:"/admin/clone_questions"},"Clone Connect Questions"),a.a.createElement(u,{activeClassName:"is-active",to:"/admin/questions"},"Diagnostic Sentence Combining"),a.a.createElement(u,{activeClassName:"is-active",to:"/admin/sentence-fragments"},"Diagnostic Sentence Fragments"),a.a.createElement(u,{activeClassName:"is-active",to:"/admin/fill-in-the-blanks"},"Diagnostic Fill In The Blanks")),a.a.createElement("p",{className:"menu-label"},"Supporting"),a.a.createElement("ul",{className:"menu-list"},a.a.createElement(u,{activeClassName:"is-active",to:"/admin/concepts"},"Concepts"),a.a.createElement(u,{activeClassName:"is-active",to:"admin/concepts-feedback"},"Concept Feedback"),a.a.createElement(u,{activeClassName:"is-active",to:"/admin/item-levels"},"Item Levels")),a.a.createElement("p",{className:"menu-label"},"Title Cards"),a.a.createElement("ul",{className:"menu-list"},a.a.createElement(u,{activeClassName:"is-active",to:"/admin/title-cards"},"Title Cards"))),a.a.createElement("div",{className:"admin-container"},this.props.children)))}});t.default=Object(c.b)(function(e){return{}})(C)},1355:function(e,t,n){"use strict";var i=n(47),s=n(32),c=n(166),o=n(0).default,u=i.a.child("diagnosticQuestions"),a=(n(2),{startListeningToDiagnosticQuestions:function(){return function(t,e){u.on("value",function(e){t({type:o.RECEIVE_DIAGNOSTIC_QUESTIONS_DATA,data:e.val()})})}},loadDiagnosticQuestions:function(){return function(t,e){u.once("value",function(e){t({type:o.RECEIVE_DIAGNOSTIC_QUESTIONS_DATA,data:e.val()})})}},startQuestionEdit:function(e){return{type:o.START_DIAGNOSTIC_QUESTION_EDIT,qid:e}},cancelQuestionEdit:function(e){return{type:o.FINISH_DIAGNOSTIC_QUESTION_EDIT,qid:e}},submitQuestionEdit:function(n,i){return function(t,e){t({type:o.SUBMIT_DIAGNOSTIC_QUESTION_EDIT,qid:n}),u.child(n).update(i,function(e){t({type:o.FINISH_DIAGNOSTIC_QUESTION_EDIT,qid:n}),t(e?{type:o.DISPLAY_ERROR,error:"Update failed! ".concat(e)}:{type:o.DISPLAY_MESSAGE,message:"Update successfully saved!"})})}},submitEditedFocusPoint:function(n,i,a){return function(e,t){u.child("".concat(n,"/focusPoints/").concat(a)).update(i,function(e){e&&alert("Submission failed! ".concat(e))})}},toggleNewQuestionModal:function(){return{type:o.TOGGLE_NEW_DIAGNOSTIC_QUESTION_MODAL}},submitNewQuestion:function(t,a){return function(n,e){n({type:o.AWAIT_NEW_DIAGNOSTIC_QUESTION_RESPONSE});var i=u.push(t,function(e){if(n({type:o.RECEIVE_NEW_DIAGNOSTIC_QUESTION_RESPONSE}),e)n({type:o.DISPLAY_ERROR,error:"Submission failed! ".concat(e)});else{a.questionUID=i.key,a.gradeIndex="human".concat(i.key),n(Object(c.j)(a)),n({type:o.DISPLAY_MESSAGE,message:"Submission successfully saved!"});var t=Object(s.push)("/admin/diagnostic-questions/".concat(i.key));n(t)}})}},submitNewFocusPoint:function(n,i){return function(e,t){u.child("".concat(n,"/focusPoints")).push(i,function(e){e&&alert("Submission failed! ".concat(e))})}},startResponseEdit:function(e,t){return{type:o.START_DIAGNOSTIC_RESPONSE_EDIT,qid:e,rid:t}},cancelResponseEdit:function(e,t){return{type:o.FINISH_DIAGNOSTIC_RESPONSE_EDIT,qid:e,rid:t}},startChildResponseView:function(e,t){return{type:o.START_CHILD_DIAGNOSTIC_RESPONSE_VIEW,qid:e,rid:t}},cancelChildResponseView:function(e,t){return{type:o.CANCEL_CHILD_DIAGNOSTIC_RESPONSE_VIEW,qid:e,rid:t}},startFromResponseView:function(e,t){return{type:o.START_FROM_DIAGNOSTIC_RESPONSE_VIEW,qid:e,rid:t}},cancelFromResponseView:function(e,t){return{type:o.CANCEL_FROM_DIAGNOSTIC_RESPONSE_VIEW,qid:e,rid:t}},startToResponseView:function(e,t){return{type:o.START_TO_DIAGNOSTIC_RESPONSE_VIEW,qid:e,rid:t}},cancelToResponseView:function(e,t){return{type:o.CANCEL_TO_DIAGNOSTIC_RESPONSE_VIEW,qid:e,rid:t}}});t.a=a},1402:function(e,t,n){"use strict";n.d(t,"b",function(){return r}),n.d(t,"a",function(){return l});var i=n(38),s=n.n(i),a=n(47),c=n(0).default,o=a.a.child("questions"),u=a.a.child("diagnostic_questions");function r(){return function(t,e){o.on("value",function(e){e&&t({type:c.RECEIVE_CONNECT_QUESTIONS_DATA,data:e.val()})})}}function l(a){return function(i){o.child(a).on("value",function(e){var t=e?e.val():null;if(t){var n=u.push(t);s()({url:"".concat("https://cms.quill.org","/responses/clone_responses"),method:"POST",json:{original_question_uid:a,new_question_uid:n.key}},function(e,t,n){i(e?{type:c.ERROR_CLONING_CONNECT_SENTENCE_COMBINING_QUESTION}:{type:c.SUCCESSFULLY_CLONED_CONNECT_SENTENCE_COMBINING_QUESTION})})}})}}},1403:function(e,t,n){"use strict";n.d(t,"b",function(){return r}),n.d(t,"a",function(){return l});var i=n(47),a=n(38),s=n.n(a),c=n(0).default,o=i.a.child("fillInBlankQuestions"),u=i.a.child("diagnostic_fillInBlankQuestions");function r(){return function(t,e){o.on("value",function(e){e&&t({type:c.RECEIVE_CONNECT_FILL_IN_BLANK_DATA,data:e.val()})})}}function l(a){return function(i){o.child(a).on("value",function(e){var t=e?e.val():null;if(t){var n=u.push(t);s()({url:"".concat("https://cms.quill.org","/responses/clone_responses"),method:"POST",json:{original_question_uid:a,new_question_uid:n.key}},function(e,t,n){i(e?{type:c.ERROR_CLONING_CONNECT_FILL_IN_BLANK_QUESTION}:{type:c.SUCCESSFULLY_CLONED_CONNECT_FILL_IN_BLANK_QUESTION})})}})}}},1404:function(e,t,n){"use strict";n.d(t,"b",function(){return r}),n.d(t,"a",function(){return l});var i=n(38),s=n.n(i),a=n(47),c=n(0).default,o=a.a.child("sentenceFragments"),u=a.a.child("diagnostic_sentenceFragments");function r(){return function(t,e){o.on("value",function(e){e&&t({type:c.RECEIVE_CONNECT_SENTENCE_FRAGMENT_DATA,data:e.val()})})}}function l(a){return function(i){o.child(a).on("value",function(e){var t=e?e.val():null;if(t){var n=u.push(t);s()({url:"".concat("https://cms.quill.org","/responses/clone_responses"),method:"POST",json:{original_question_uid:a,new_question_uid:n.key}},function(e,t,n){i(e?{type:c.ERROR_CLONING_CONNECT_SENTENCE_FRAGMENT}:{type:c.SUCCESSFULLY_CLONED_CONNECT_SENTENCE_FRAGMENT})})}})}}}}]);