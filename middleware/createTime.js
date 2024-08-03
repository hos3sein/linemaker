const moment = require("moment");

const generateAllTimeInDays = async (
  days,
  interval,
  startDaysAt,
  endDaysAt,
  restStartDaysAt,
  restEndDaysAt,
  price
) => {
  let result = [];
  let restArr = [];
  let delArr = [];

  for (let i = 0; i < days.length; i++) {
    //   generate all time in day
    let daysWithStart = await moment(
      days[i] + " " + startDaysAt,
      "YYYY-MM-DD HH:mm"
    );
    let daysWithEnd = await moment(
      days[i] + " " + endDaysAt,
      "YYYY-MM-DD HH:mm"
    );
    while (daysWithStart <= daysWithEnd) {
      try {
        await result.push({
          time: new moment(daysWithStart).format("YYYY-MM-DD HH:mm"),
          isActive: true,
          blocked: false,
          booked: false,
          rest: false,
          price: price,
        });
        await daysWithStart.add(interval, "minutes");
      } catch (err) {
        console.log("erooooo", err);
      }
    }
    //   generate all REST in day
    let restStart = await moment(
      days[i] + " " + restStartDaysAt,
      "YYYY-MM-DD HH:mm"
    );
    let restEnd = await moment(
      days[i] + " " + restEndDaysAt,
      "YYYY-MM-DD HH:mm"
    );
    while (restStart < restEnd) {
      await restArr.push({
        time: new moment(restStart).format("YYYY-MM-DD HH:mm"),
        isActive: false,
        blocked: false,
        booked: false,
        rest: true,
        price: price,
      });
      await restStart.add(interval, "minutes");
      await restArr.push({
        time: new moment(restEnd).format("YYYY-MM-DD HH:mm"),
        isActive: false,
        blocked: false,
        booked: false,
        rest: true,
        price: price,
      });
    }

    // find all booked and push delArr
    books.map(async (items) => {
      if (items.time.substring(0, 10) === days[i]) {
        await delArr.push({
          time: items.time.toString(),
          isActive: false,
          blocked: false,
          booked: true,
          rest: false,
          price: price,
        });
      }
    });
  }
  const deleteArray = await [...delArr, ...restArr];

  const between = (x, min, max) => {
    if (x >= min && x <= max) {
      return true;
    }
  };

  for (let index = 0; index < result.length; index++) {
    const element = result[index];
    const convertElement = moment(element.time).unix();

    for (let J = 0; J < deleteArray.length; J++) {
      const delElement = deleteArray[J];
      const convertDelElement = moment(delElement.time).unix();
      //   console.log("convertDelElement", convertDelElement);
      //   console.log("convertElement", convertElement);

      //   console.log("-interval * 60 * 1000", -interval * 60 + 10);
      //   console.log("interval * 60 ", interval * 60 + 10);

      console.log(
        "convertDelElement - convertElement",
        convertDelElement - convertElement
      );

      const check = between(
        convertDelElement - convertElement,
        -interval * 60 + 10,
        interval * 60 + 10
      );
      //   console.log(check);
      if (check) {
        result[index].isActive = false;
        result[index].blocked = true;
      }
    }
  }

  // console.log(result);

  return result;
};
