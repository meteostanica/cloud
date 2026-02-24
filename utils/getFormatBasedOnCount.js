export default (formats, count) => {
  const keys = Object.keys(formats)
  
  let formatNumber;
  
  for (const key of keys) {
    if (key > count) continue;
    
    if (!formatNumber || formatNumber < key) {
      formatNumber = key
    }
  }

  return formats[formatNumber];
}