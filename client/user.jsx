const React = require('react');
const ReactDOM = require('react-dom/client');
// const helper = require('./helper.js');

const contentRoot = ReactDOM.createRoot(document.getElementById('content'));

window.onload = () => { contentRoot.render(<div>You Betcha!</div>); };
