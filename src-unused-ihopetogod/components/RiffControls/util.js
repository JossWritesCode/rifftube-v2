export const baseURL = "http://localhost";
export const baseURL2 = "http://localhost:3001";


export const executeScriptElements = (containerElement) =>
{
  //debugger;
  
  console.log("reworking scripts");

  const scriptElements = containerElement.querySelectorAll("script");

  Array.from(scriptElements).forEach((scriptElement) => {
    const clonedElement = document.createElement("script");

    Array.from(scriptElement.attributes).forEach((attribute) => {
      clonedElement.setAttribute(attribute.name, attribute.value);
    });
    
    clonedElement.text = scriptElement.text;

    console.log("rework: ", clonedElement);

    scriptElement.parentNode.replaceChild(clonedElement, scriptElement);
  });
}


export const debounce = (func, delay) => {
  let debounceTimer
  return function() {
      const context = this
      const args = arguments
          clearTimeout(debounceTimer)
              debounceTimer
          = setTimeout(() => func.apply(context, args), delay)
  }
}


export const duplicateBlob = (blob) =>
{
    return blob?.slice(0, blob.size, blob.type);
}



  /* extracts the youtube id from a url. got help from: https://ctrlq.org/code/19797-regex-youtube-id */
  export const extractVideoID = (url) =>
  {
    var regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    if (match && match[7].length === 11) {
      return match[7];
    } else {
      return url; // if extraction fails, fallback on assuming they gave an ID
    }
  };

  // convert keys from e.g. 'riff[start]' to 'start'
  // leave non-matching keys unchanged
export const riffKeyMatcher = key => key.match(/riff\[(\w+)\]/)?.[1] ?? key;

const riffNumericFields = ["riff[start]", "riff[duration]"];

// get FormData entries
export const FD2Obj =
(detail, keyMatcherCallback, numericFields) =>
  Object.fromEntries(
    Array.from(detail.entries())
    .map(
      ([key, val]) =>
      (
        [
          keyMatcherCallback(key),
          numericFields.includes(key) ? Number(val) : val
        ]
      )
    )
  );

  export const riffFD2Obj = detail => FD2Obj(detail, riffKeyMatcher, riffNumericFields);