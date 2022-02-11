import * as moment from "moment";

export class Utils {

  static getRelativeHours(hr: any) {
    var date = new Date();
    var relativeDateTime = moment(date).subtract('hours', hr); //to get the date object
    return relativeDateTime.toISOString().split('.')[0]; //In UTC
  }

  static getRelativeDays(day: any) {
    var date = new Date();
    var relativeDateTime = moment(date).subtract('day', day);//to get the date object
    return relativeDateTime.toISOString().split('.')[0]; //In UTC
  }

  static getRelativeMonths(month: any) {
    var date = new Date();
    var relativeDateTime = moment(date).subtract('month', month); //to get the date object
    return relativeDateTime.toISOString().split('.')[0]; //In UTC
  }

  static convertUTCDateToLocalDate(date: string | number | Date) {
    var d = new Date(date);
    var time = d.getTime();
    var offset = d.getTimezoneOffset() * 60 * 1000;
    var nd = time - offset;
    var newDate = new Date(nd);
    return newDate;
  }

  static convertMilitaryTimeToStandardTime(time: any) {
    var splitTime = time.split(':');
    var _hrs = splitTime[0];
    var _mins = splitTime[1];

    if (parseInt(_hrs) > 12) {
      _hrs = (parseInt(_hrs) - 12).toString();
      if (parseInt(_hrs) < 10) {
        // _hrs=("0"+_hrs).toString();
      }
      return _hrs + ":" + _mins + " pm";
    }
    else if (parseInt(_hrs) < 12 && parseInt(_hrs) != 0) {
      if (parseInt(_hrs) < 10) {
        // _hrs=("0"+_hrs).toString();
      }
      return _hrs + ":" + _mins + " am";
    }
    else if (parseInt(_hrs) == 12) {
      return "12:00 pm";
    }
    else if (parseInt(_hrs) == 0) {
      return "12:00 am";
    }
    else {
      return "";
    }
  }

  static isEmpty(obj: any) {
    if (Object.keys(obj).length == 0) {
      return true;
    }
    else {
      return false;
    }
  }

  //Scroll to the top of the screen
  static gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
