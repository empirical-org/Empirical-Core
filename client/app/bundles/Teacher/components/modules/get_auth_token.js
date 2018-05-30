export default () => document.getElementsByName('csrf-token')[0] ? document.getElementsByName('csrf-token')[0].content : 0;
