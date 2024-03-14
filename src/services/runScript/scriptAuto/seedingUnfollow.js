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
          if (listFollowing.length > 0) {
            const index = getRandomInt(listFollowing.length);
            if (listFollowing[index]) {
              await listFollowing[index].scrollIntoView({
                behavior: "smooth", block: "center", inline: "nearest"
              });
        
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

  const scrollRight = async (page, element) => {
    const elem = await page.$('[class="x7r02ix xf1ldfh x131esax xdajt7p xxfnqb6 xb88tzc xw2csxc x1odjw0f x5fp0pe"]');
    const boundingBox = await elem.boundingBox();
    await page.mouse.move(
      boundingBox.x + boundingBox.width / 2, // x
      boundingBox.y + boundingBox.height / 2 // y
    );
    await delay(getRandomIntBetween(1000, 3000));
    await scrollSmoothIfElementNotExistOnScreens(page, element)
  
  //  await page.mouse.wheel({ deltaX: 2500 });
  }
  
  const scrollSmoothIfElementNotExistOnScreens = async (page, element) => {
    try {
      await page.evaluate(async element => {
        const getRandomIntBetween = (min, max) => {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        const delay = async time => {
          return new Promise(resolve => setTimeout(resolve, time));
        };
        const smoothScrollByStep = async (targetPosition, duration) => {
          const startPosition = window.scrollY;
          const distance = targetPosition - startPosition;
          let startTime = null;
  
          const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t + b;
            t--;
            return (-c / 2) * (t * (t - 2) - 1) + b;
          };
  
          const animation = currentTime => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
          };
  
          requestAnimationFrame(animation);
        };
  
        const isInViewport = elem => {
          const bounding = elem.getBoundingClientRect();
          return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <=
              (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <=
              (window.innerWidth || document.documentElement.clientWidth)
          );
        };
  
        if (element && !isInViewport(element)) {
          const elementRect = element.getBoundingClientRect();
          const viewportHeight =
            window.innerHeight || document.documentElement.clientHeight;
          const targetPosition =
            window.scrollY +
            elementRect.top -
            (elementRect.top > viewportHeight ? viewportHeight : 0);
  
          let currentPosition = window.scrollY;
          while (
            Math.abs(currentPosition - targetPosition) > 0 &&
            !isInViewport(element)
          ) {
            const stepSize =
              getRandomIntBetween(150, 500) *
              (currentPosition > targetPosition ? -1 : 1);
            const durationPerStep = getRandomIntBetween(500, 2000);
            const nextPosition = currentPosition + stepSize;
            await smoothScrollByStep(nextPosition, durationPerStep);
            await delay(getRandomIntBetween(1000, 3000));
            if (Math.random() < 0.3) {
              await delay(getRandomIntBetween(2000, 4000));
            }
            currentPosition = window.scrollY;
          }
          await delay(getRandomIntBetween(2000, 3000));
        }
      }, element);
      return true;
    } catch (error) {
      logger(error);
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
