export default function(str) {
  return str.replace(/(<\/?[^>]+(>)|(&nbsp;)|$)/g, "")
}
