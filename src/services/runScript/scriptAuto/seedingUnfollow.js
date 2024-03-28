export const unfollow = (setting) => {
  const strSetting = `
      {             
        typeUnfollow: ${JSON.stringify(setting.typeUnfollow)},
        numberStart: ${setting.numberStart},
        numberEnd: ${setting.numberEnd},
        userList: ${JSON.stringify(setting.userList)},     
      }`;
  console.log(strSetting);
  return `
  const accessProfile = async page => {
    try {
      const profileEle = await getElement(page, 'span a [role="link"]');
      if (!profileEle) {
        logger("Err find profile button");
        return false;
      }
      await clickElement(profileEle);
      await delay(getRandomIntBetween(3000, 5000));
      let followingEle = await selectorHref(page, "/following/");
      if (!followingEle) {
        logger("Err find following button");
        return false;
      }
      await clickElement(followingEle);
      await delay(getRandomIntBetween(3000, 5000));
      return true;
    } catch (error) {
      logger("Err access profile " + error.message);
      return false;
    }
  };

  const testScroll = async (page, element, container) => {
    try {
      await page.evaluate(async (element, container) => {
        const getRandomIntBetween = (min, max) => {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const isInViewport = (elem, container) => {
          const bounding = elem.getBoundingClientRect();
          return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <=
              (container.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <=
              (container.innerWidth || document.documentElement.clientWidth)
          );
        };
 
        if (!container) return; // Kiểm tra xem container có tồn tại không

        if (!element || isInViewport(element, container)) return;
  
        const smoothScrollByStep = (targetPosition, duration, container) => {
          const startPosition = container.scrollTop;
          const distance = targetPosition - startPosition;
          let startTime = null;
          const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t + b;
            t--;
            return (-c / 2) * (t * (t - 2) - 1) + b;
          };
          const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            container.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
          };
          requestAnimationFrame(animation);
        };
  
        const elementRect = element.getBoundingClientRect();
        console.log("check1");
        const viewportHeight =
          container.innerHeight || document.documentElement.clientHeight;
        const targetPosition =
          container.scrollTop +
          elementRect.top -
          (elementRect.top > viewportHeight ? viewportHeight : 0);
        let currentPosition = container.scrollTop;
        while (
          Math.abs(currentPosition - targetPosition) > 0 &&
          !isInViewport(element, container)
        ) {
          const stepSize =
            getRandomIntBetween(100, 200) *
            (currentPosition > targetPosition ? -1 : 1);
          const durationPerStep = getRandomIntBetween(1000, 2000);
          const nextPosition = currentPosition + stepSize;
          smoothScrollByStep(nextPosition, durationPerStep, container);
          await delay(getRandomIntBetween(1000, 2000));
          if (Math.random() < 0.3) {
            await delay(getRandomIntBetween(3000, 5000));
          }
          currentPosition = container.scrollTop; // Sử dụng container.scrollTop thay vì window.scrollTop
        }
      }, element, container);
      return true;
    } catch (error) {
      logger(error);
      return false;
    }
  };
  
  const actionUnFollow = async (page, unFollowObj) => {
    try {
      if (unFollowObj.typeUnfollow === "random") {
        let countUnFollow = 0;
        const numsUnFollow = getRandomIntBetween(
          unFollowObj.numberStart,
          unFollowObj.numberEnd
        );
        for (let i = 0; i < numsUnFollow; i++) {
          const listFollowing = await getElements(
            page,
            '[class=" _acan _acap _acat _aj1- _ap30"]'
          );
          await delay(getRandomIntBetween(3000, 5000));
          if (listFollowing && listFollowing.length > 0) {
            const index = getRandomInt(listFollowing.length);
            if (listFollowing[index]) {
              const container = await getElement(page, '[class="_aano"]')
              if (container) {
                await testScroll(page, listFollowing[index], container)
              }
              
              await delay(getRandomIntBetween(1000, 3000));
              await clickElement(listFollowing[index]);
              await delay(getRandomIntBetween(3000, 5000));
              const buttonUnfollow = await getElement(
                page,
                'button[class="_a9-- _ap36 _a9-_"]'
              );
              if (buttonUnfollow) {
                await clickElement(buttonUnfollow);
                await delay(getRandomIntBetween(3000, 5000));
              } else {
                i--;
                const buttonCancel = await getElement(
                  page,
                  'button[class="_a9-- _ap36 _a9_1"]'
                );
                await clickElement(buttonCancel);
                await delay(getRandomIntBetween(3000, 5000));
                continue;
              }
            } else {
              i--;
              continue;
            }
            countUnFollow++;
            logger("Unfollow " + countUnFollow + " person");
          } else {
            logger("Debug|Unfollow|User is not following");
            return;
          }
        }
      } else if (unFollowObj.typeUnfollow === "user") {
        for (let i = 0; i < unFollowObj.userList.length; i++) {
          let searchEle = await getElement(
            page,
            'input[class="x1lugfcp x19g9edo x1lq5wgf xgqcy7u x30kzoy x9jhf4c x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x5n08af x5yr21d x1a2a7pz xyqdw3p x1pi30zi xg8j3zb x1swvt13 x1yc453h xh8yej3 xhtitgo xs3hnx8 xoy4bel x7xwk5j xvs91rp xp001vz"]'
          );
          if (!searchEle) {
            searchEle = await getElement(
              page,
              '[class="xwib8y2 x1swvt13 x1pi30zi x1y1aw1k"] input'
            );
            if (!searchEle) {
              searchEle = await getElement(
                page,
                '[class="xwib8y2 x1swvt13 x1pi30zi x1y1aw1k"]'
              );
            }
          }
          if (searchEle) {
            await searchEle.type(unFollowObj.userList[i], { delay: 200 });
            await delay(getRandomIntBetween(3000, 5000));
            const following = await getElement(
              page,
              '[class=" _acan _acap _acat _aj1- _ap30"]'
            );
            if (following) {
              await clickElement(following);
              await delay(getRandomIntBetween(3000, 5000));
              const buttonUnfollow = await getElement(
                page,
                'button[class="_a9-- _ap36 _a9-_"]'
              );
              if (buttonUnfollow) {
                await clickElement(buttonUnfollow);
                await delay(getRandomIntBetween(3000, 5000));
                logger("Done unfollow");
              }
              const clearSearchEle = await getElement(
                page,
                '[class="_aawn _9-lv"]'
              );
              await delay(getRandomIntBetween(3000, 5000));
              if (clearSearchEle) {
                await clickElement(clearSearchEle);
                await delay(getRandomIntBetween(3000, 5000));
              }
            } else {
              const clearSearchEle = await getElement(
                page,
                '[class="_aawn _9-lv"]'
              );
              await delay(getRandomIntBetween(3000, 5000));
              if (clearSearchEle) {
                await clickElement(clearSearchEle);
                await delay(getRandomIntBetween(3000, 5000));
              } else {
                i--;
                continue;
              }
            }
          }
        }
      } else {
        logger("Debug|Unfollow|User is not select type unfollow. Ex: random, user,...");
        return;
      }
    } catch (error) {
      logger("Debug|Unfollow|Err action unfollow " + error.message);
      return;
    }
  };
  
  const selectorHref = async (page, namePage = "", indexHref) => {
    try {
      const href = await page.$$eval("a", links => links.map(a => a.href));
      if (href.length > 0) {
        const hrefPage = href.filter(e => e.includes(namePage));
        if (hrefPage.length > 0) {
          const index = indexHref ? indexHref : getRandomInt(hrefPage.length);
          const selector = '[href="'+hrefPage[index].replace('https://www.instagram.com', '')+'"]';
          const clickBtn = await getElement(page, selector);
          if (clickBtn) {
            return clickBtn;
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      logger("Err access page by href " + error.message);
      return false;
    }
  };

 let unFollowObj = ${strSetting};
 try {
  const isLive = await checkIsLive(page);
  if (!isLive) {
    logger("Debug|Unfollow|Page is die");
    return;
  }
  await returnHomePage(page);
  await delay(2000);
  await turnOffNoti(page);
  unFollowObj = await checkObject(unFollowObj);
  await delay(getRandomIntBetween(3000, 5000));
  const isAccessProfile = await accessProfile(page);
  if (isAccessProfile) {
    await actionUnFollow(page, unFollowObj);
  } else {
    logger("Debug|Unfollow|Err access profile");
    return;
  }
} catch (error) {
  logger("Debug|Unfollow|Err unfollow " + error.message);
}
  `;
};
