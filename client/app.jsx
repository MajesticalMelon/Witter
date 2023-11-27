const React = require('react');
const ReactDOM = require('react-dom/client');

const contentRoot = ReactDOM.createRoot(document.getElementById('content'));

const TestPage = () => <div>App!</div>;

window.onload = () => contentRoot.render(<TestPage />);
