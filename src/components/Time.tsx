const dateFormat = () => {
  let objectDate = new Date();
  let day = `0${objectDate.getDate()}`;

  let month: string | number = objectDate.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }

  let year = objectDate.getFullYear();
  let hour = objectDate.getHours();
  let minute : string | number = objectDate.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }

  let dateFormat = `${day}-${month}-${year} ${hour}:${minute}`;

  return dateFormat;
}

export default dateFormat