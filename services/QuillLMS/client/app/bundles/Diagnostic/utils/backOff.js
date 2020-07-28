export default function () {
  window.addEventListener('keydown',function (e) {
    if (e.keyIdentifier=='U+0008'||e.keyIdentifier=='Backspace'||e.keyCode==8) {
      if(e.target==document.body) {
        e.preventDefault();
        return false;
      }
    }
  },true);
}
