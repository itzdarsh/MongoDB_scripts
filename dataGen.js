function returnJson(jsonDoc, n) {
    const tempArr = [];
  
    for (let i = 0; i < n; i++) {
      const similarJson = find_data_type(jsonDoc);
      tempArr.push(similarJson);
    }
  
    return tempArr;
  }
  
  function find_data_type(value) {
    if (Array.isArray(value)) {
      // Handle arrays
      return value.map(item => find_data_type(item));
    } else if (typeof value === 'object' && value !== null) {
      // Handle objects
      const newObj = {};
      for (let prop in value) {
        if (value.hasOwnProperty(prop)) {
          newObj[prop] = find_data_type(value[prop]);
        }
      }
      return newObj;
    } else {
      // Handle other data types (e.g., numbers, strings, booleans)
      if (typeof value === 'number') {
        //return create_num(value.toString().length);
        return Number(checkSubType(value.toString()))
      } else if (typeof value === 'string') {
        return checkSubType(value)
      } else if (typeof value === 'boolean') {
        return Math.random() < 0.5;
      } else {
        return null;
      }
    }
  }
  
 function create_num(length) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  
  function create_str(length) {
    return [...Array(length)].map(() => String.fromCharCode(97 + Math.random() * 26)).join('').replace(/(\b\w)/g, (c) => c.toUpperCase());
  }
  
  function checkSubType(str) {
    const regexLettersOnly = /^[A-Za-z]+$/;
    const regexNumbersOnly = /^[0-9]+$/;
    const regexAlphanumeric = /^[A-Za-z0-9]+$/;
  
    if (regexLettersOnly.test(str)) {
      return create_str(str.length);
    } else if (regexNumbersOnly.test(str)) {
      return create_num(str.toString().length).toString();
    } else if (regexAlphanumeric.test(str)) {
      return create_num((Math.ceil((str.toString().length)/2))).toString() + create_str((Math.floor((str.length)/2)))
    } else if (/^[0-9]+(\.)[0-9]$/.test(str)) {
        return create_num(str.split(".")[0].length)+"."+create_num(str.split(".")[1].length)
    } else {
        //return create_str(str.length);
      return "Mixed characters";
    }
  }

  