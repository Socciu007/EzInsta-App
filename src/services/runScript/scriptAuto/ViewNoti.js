export const viewNoti = (setting) => {
  const strSetting = `{
      notificationStart: ${setting.notificationStart},
      notificationEnd: ${setting.notificationEnd},
      delayTimeStart: ${setting.delayTimeStart},
      delayTimeEnd: ${setting.delayTimeEnd},      
      viewTimeStart: ${setting.viewTimeStart},
      viewTimeEnd: ${setting.viewTimeEnd},
    }`;
  console.log(setting);
  return `

  const scrollNotiSmooth = async (page, randomScrollTime) => {
      try {
        while(randomScrollTime > 0){
        const isLive = checkIsLive(page);
          if (!isLive) {
            return -2;
          }
        await page.evaluate(() => {
            const getRandomIntBetween = (min, max) => {
              return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            const smoothScrollByStep = (targetPosition, duration) => {
              const startPosition = window.scrollY;
              const distance = targetPosition - startPosition;
              let startTime = null;
              const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
              };
              const ease = (t, b, c, d) => {
                t /= d / 2;
                if (t < 1) return (c / 2) * t * t + b;
                t--;
                return (-c / 2) * (t * (t - 2) - 1) + b;
              };
              requestAnimationFrame(animation);
            };
            let scrollAmount = getRandomIntBetween(150, 250);
            const targetPosition = window.scrollY + scrollAmount;
            let currentPosition = window.scrollY;
            if (currentPosition < targetPosition) {
              const durationPerStep = getRandomIntBetween(700, 1000);
              const nextPosition = Math.max(
                currentPosition + scrollAmount,
                targetPosition
              );
              smoothScrollByStep(nextPosition, durationPerStep);
            }
          });
          randomScrollTime--;
        }
          return 1;
      } catch (error) {
        return 0;
      }
    };
    
  const notiObj = ${strSetting}
try {
  //Check obj start < end ? random(start,end) : random(end,start)
  let notiObject = await checkObject(notiObj);
  // check page is live return -1, return 1, return 0
  const isLive = checkIsLive(page);
  logger("Tình trạng trang web:" + isLive);
  if (!isLive) return -1;
  await returnHomePage(page);
  await delay(3000);
  let randomDelay = getRandomIntBetween(
    notiObject.delayTimeStart * 1000,
    notiObject.delayTimeEnd * 1000
  );
  // let quantity = getRandomIntBetween(
  //   notiObject.notificationStart,
  //   notiObject.notificationEnd
  // );
  // logger("quantity " + quantity);
  let quantity = 0;
  let randomViewTime = getRandomIntBetween(
    notiObject.viewTimeStart * 1000,
    notiObject.viewTimeEnd * 1000
  );
  const notiIcon = await getElement(
    page,
    'a [d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"]'
  );
  if (notiIcon) {
    await notiIcon.click();
  } else {
    logger("không có nút notification");
    await page.goto("https://www.instagram.com/notifications/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
  }

  await delay(3000);
  let temp = 0;
  let count = 0;
  while (randomViewTime > 0) {
    let startTime = Date.now();
    // await scrollNotiSmooth(page, 1);
    await delay(randomDelay);
    let notifications = await getElements(
      page,
      '[data-pressable-container="true"]'
    );
    if (!notifications) {
       logger(
            "Debug" + "|" + "View Notifications" + "|" + "Cannot find any notifications"
          );
      return false;
    }

    logger(notifications.length);
    if (count < quantity) {
      if(temp > 0){
        await scrollSmoothIfElementNotExistOnScreen(page, notifications[temp]);
        logger("đã scroll tới vị trí cũ " + temp);
      }
      const url = page.url();
      for (let i = temp; i < notifications.length; i++) {
        const followBtns = await getElements(
          page,
          '[data-pressable-container="true"] button'
        );
        if (followBtns.length == notifications.length) {
          logger("Chỉ lướt xem");
          break;
        }
        const isOnScreen = await checkExistElementOnScreen(
          page,
          notifications[i]
        );
        if (isOnScreen == 0) {
          temp = i;
          await delay(2000);
          await notifications[i].click();
          await delay(5000);
          logger("đã click");
          if (page.url() === url) {
            logger("không chuyển trang");
          } else {
            count++;
            await delay(4000);
            await page.goBack();
            await delay(randomDelay);
            break;
          }
        }
      }
    }
    else if(temp >= notifications.length - 1){
      logger('Da xem het noti');
      break;
    }
    else {
      await scrollNotiSmooth(page, 1);
      await delay(getRandomIntBetween(2000,4000));
    }

    let endTime = Date.now();
    randomViewTime -= endTime - startTime;
  }
} catch (error) {
  logger(error);
}
    `;
};
