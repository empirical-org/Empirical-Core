export default function handleFocus(e) {
  console.log("Inside modular component, e: ", e)
  const indexOfUnderscores = e.target.value.indexOf("_");
  const lastIndexOfUnderscores = e.target.value.lastIndexOf("_");
  if (indexOfUnderscores !== -1) {
    setTimeout(()=>{
      e.target.selectionStart = indexOfUnderscores
      e.target.selectionEnd = lastIndexOfUnderscores + 1
    }, 50)
  }
}
