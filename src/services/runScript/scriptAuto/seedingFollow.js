export const seedingFollow = (setting) => {
  const strSetting = `
      {
        numberStart:${setting.numberStart},
        numberEnd: ${setting.numberEnd},
        typeFollow: ${JSON.stringify(setting.typeFollow)},
        postList: ${JSON.stringify(setting.postList)},
        userList: ${JSON.stringify(setting.userList)},
        search: ${JSON.stringify(setting.search)},
        searchByKeyword: ${JSON.stringify(setting.searchByKeyword)},
        searchByUser: ${JSON.stringify(setting.searchByUser)},
      }`;
  console.log(strSetting);
  return `
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
        console.log('container.scrollTop', container.scrollTop)
 
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
  const accessProfile = async page => {
    try {
      const profileEle = await getElement(page, 'span a [role="link"]');
      if (!profileEle) {
        logger("Err find profile button");
        return false;
      }
      await profileEle.click();
      await delay(getRandomIntBetween(3000, 5000));
      let followingEle = await selectorHref(page, "/followers/");
      if (!followingEle) {
        logger("Err find followers button");
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
  
  const followUserLikingPost = async (page, listPost, numsFollow, err) => {
    try {
      for (let i = 0; i < listPost.length; i++) {
        let count = 0;
        await delay(getRandomIntBetween(3000, 5000));
        const link = 'https://www.instagram.com/p/'+listPost[i]+'/';
        await navigateToUrl(page, link);
        await delay(getRandomIntBetween(3000, 5000));
        let likedPersonEle = await getElement(
          page,
          '[class="html-span xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x1hl2dhg x16tdsg8 x1vvkbs"]'
        );
        if (!likedPersonEle) {
          likedPersonEle = await getElement(
            page,
            '[class="x193iq5w xeuugli x1fj9vlw x13faqbe x1vvkbs xt0psk2 x1i0vuye xvs91rp x1s688f x5n08af x10wh9bi x1wdrske x8viiok x18hxmgj"]'
          );
        }
        await delay(getRandomIntBetween(3000, 5000));
        await clickElement(likedPersonEle);
        await delay(getRandomIntBetween(3000, 5000));
        while (count < numsFollow) {
          const listFollowEles = await getElements(
            page,
            'button[class=" _acan _acap _acas _aj1- _ap30"]'
          );
          if (listFollowEles.length > 0) {
            const index = getRandomInt(listFollowEles.length);
            const container = await getElement(page, '[class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1pi30zi x1swvt13 x1uhb9sk x6ikm8r x1rife3k x1iyjqo2 x2lwn1j xeuugli xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1"]')
            if (container) {
              await testScroll(page, listFollowEles[index], container);
              await delay(getRandomIntBetween(3000, 5000));
            }
            await delay(getRandomIntBetween(3000, 5000));
            await clickElement(listFollowEles[index]);
            await delay(getRandomIntBetween(3000, 5000));
            count++;
            logger("Done follow " + count + " person");
            await delay(getRandomIntBetween(3000, 5000));
          } else {
            err["err"] = "Debug|Follow|No liked person to follow"
            return;
          }
        }
      }
      logger("Complete follow user's liking posts");
    } catch (error) {
      err["err"] = "Debug|Follow|Err follow user liking posts " + error.message
      return;
    }
  };
  
  const followByFollowers = async (page, numsFollow, err) => {
    try {
      const listFollower = await getElements(
        page,
        'button[type="button"] [class="_ap3a _aacn _aacw _aad6"]'
      );
  
      if (!listFollower || listFollower.length < 1) {
        err["err"] = "Debug|Follow|No follower to follow"
        return;
      } else if (numsFollow >= listFollower.length) {
        for (let i = 0; i < listFollower.length; i++) {
          const container = await getElement(page, '[class="_aano"]')
          if (container) {
            await testScroll(page, listFollower[i], container);
            await delay(getRandomIntBetween(3000, 5000));
          }
          await clickElement(listFollower[i]);
          await delay(getRandomIntBetween(3000, 5000));
          logger("Follow " + i + 1 + " person");
          await delay(getRandomIntBetween(3000, 5000));
        }
        logger(
          "The number of follow request is greater than number of followers, so just follow up " +
            listFollower.length
        );
      } else {
        for (let i = 0; i < numsFollow; i++) {
          const index = getRandomInt(listFollower.length);
          if (listFollower[index]) {
            const container = await getElement(page, '[class="_aano"]')
            if (container) {
              await testScroll(page, listFollower[index], container);
              await delay(getRandomIntBetween(3000, 5000));
            }
            await delay(getRandomIntBetween(3000, 5000));
            await clickElement(listFollower[index]);
            await delay(getRandomIntBetween(3000, 5000));
            logger("Follow " + i + 1 + " person");
            await delay(getRandomIntBetween(3000, 5000));
          } else {
            i--;
            continue;
          }
        }
      }
    } catch (error) {
      err["err"] = "Debug|Follow|Err follow by followers" + error.message
      return;
    }
  };
  
  const followByUserFollowerOrFollowing = async (page, typeFollow, numsFollow, listUsers, err) => {
    try {
      if (listUsers && listUsers.length > 0) {
        for (let i = 0; i < listUsers.length; i++) {
          let count = 0;
          await delay(getRandomIntBetween(3000, 5000));
          const link = 'https://www.instagram.com/'+listUsers[i]+'/';
          await navigateToUrl(page, link);
          await delay(getRandomIntBetween(3000, 5000));
          if (typeFollow === "byUserFollower") {
            let followingEle = await selectorHref(page, "/followers/");
            if (!followingEle) {
              logger("Err find follower button or account private")
              continue;
              // err["err"] = "Debug|Follow|Err find follower button or account private"
              // return;
            }
            await clickElement(followingEle);
            await delay(getRandomIntBetween(3000, 5000));
            while (count < numsFollow) {
              const listFollowEles = await getElements(
                page,
                '[class="_aano"] button[class=" _acan _acap _acas _aj1- _ap30"]'
              );
              if (listFollowEles.length > 0) {
                const index = getRandomInt(listFollowEles.length);
                const container = await getElement(page, '[class="_aano"]')
                if (container) {
                  await testScroll(page, listFollowEles[index], container);
                  await delay(getRandomIntBetween(3000, 5000));
                }
                await delay(getRandomIntBetween(3000, 5000));
                await clickElement(listFollowEles[index]);
                await delay(getRandomIntBetween(3000, 5000));
                count++;
                logger("Done follow " + count + " person");
                await delay(getRandomIntBetween(3000, 5000));
              } else {
                err["err"] = "Debug|Follow|No user's follower to follow"
                return;
              }
            }
          }
          if (typeFollow === "byUserFollowing") {
            let followingEle = await selectorHref(page, "/following/");
            if (!followingEle) {
              logger("Err find following button or account private")
              continue;
              // err["err"] = "Debug|Follow|Err find following button or account private"
              // return;
            }
            await clickElement(followingEle);
            await delay(getRandomIntBetween(3000, 5000));
            while (count < numsFollow) {
              const listFollowEles = await getElements(
                page,
                '[class="_aano"] button[class=" _acan _acap _acas _aj1- _ap30"]'
              );
              if (listFollowEles.length > 0) {
                const index = getRandomInt(listFollowEles.length);
                const container = await getElement(page, '[class="_aano"]')
                if (container) {
                  await testScroll(page, listFollowEles[index], container);
                  await delay(getRandomIntBetween(3000, 5000));
                }
                await delay(getRandomIntBetween(3000, 5000));
                await clickElement(listFollowEles[index]);
                await delay(getRandomIntBetween(3000, 5000));
                count++;
                logger("Done follow " + count + " person");
                await delay(getRandomIntBetween(3000, 5000));
              } else {
                err["err"] = "Debug|Follow|No user's following to follow"
                return;
              }
            }
          }
          await delay(getRandomIntBetween(3000, 5000));
        }
        logger("Complete follow by users follower/ following");
      } else {
        err["err"] = "Debug|Follow|You need import user list"
        return;
      }
    } catch (error) {
      err["err"] = "Debug|Follow|Err follow by user follower/ user following " + error.message;
      return;
    }
  };
  
  const followBySearch = async (page, typeSearch, listUsers, listKeywords, err) => {
    try {
      let countFollow = 0;
      if (typeSearch === "searchByUser") {
        if (listUsers.length && listUsers.length > 0) {
          for (let i = 0; i < listUsers.length; i++) {
            const searchEle = await getElement(
              page,
              '[d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"]'
            );
            if (searchEle) {
              await clickElement(searchEle);
              await delay(getRandomIntBetween(3000, 5000));
            }
            const isFollowBySearchUser = await searchByUser(page, listUsers[i]);
            if (isFollowBySearchUser) {
              //back home
              let backEle = await getElement(page, 'nav header button[type="button"] [d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"]')
              if (!backEle) {
                backEle = await getElement(page, '[style="display: inline-block; transform: rotate(270deg);"] [d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"]')
                if (!backEle) {
                  backEle = await getElement(page, '[class="_abm0"] [d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"]')
                }
              }
              if (backEle) {
                await clickElement(backEle);
                await delay(getRandomIntBetween(3000, 5000));
              } else {
                await navigateToUrl(page, 'https://www.instagram.com/')
                await delay(getRandomIntBetween(3000, 5000));
              }
              countFollow++;
              logger("Follow " + countFollow + " person");
            } else {
              //back home
              let backEle = await getElement(page, 'nav header button[type="button"] [d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"]')
              if (!backEle) {
                backEle = await getElement(page, '[style="display: inline-block; transform: rotate(270deg);"] [d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"]')
                if (!backEle) {
                  backEle = await getElement(page, '[class="_abm0"] [d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"]')
                }
              }
              if (backEle) {
                await clickElement(backEle);
                await delay(getRandomIntBetween(3000, 5000));
              } else {
                await navigateToUrl(page, 'https://www.instagram.com/')
                await delay(getRandomIntBetween(3000, 5000));
              }
              continue;
            }
          }
          logger("Complete follow by search user");
        } else {
          err["err"] = "Debug|Follow|You need import username into input search";
          return;
        }
      }
      if (typeSearch === "searchByKey") {
        if (listKeywords.length && listKeywords.length > 0) {
          for (let i = 0; i < listKeywords.length; i++) {
            const searchEle = await getElement(
              page,
              '[d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"]'
            );
            if (searchEle) {
              await clickElement(searchEle);
              await delay(getRandomIntBetween(3000, 5000));
            }
            const isSearchByKey = await searchByKey(page, listKeywords[i]);
            if (isSearchByKey) {
              //back home
              let backEle = await getElement(page, 'nav header button[type="button"] [d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"]')
              if (!backEle) {
                backEle = await getElement(page, '[class="_abm0"] [d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"]')
                if (!backEle) {
                  backEle = await getElement(page, '[style="display: inline-block; transform: rotate(270deg);"] [d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"]')
                }
              }
              if (backEle) {
                await clickElement(backEle);
                await delay(getRandomIntBetween(3000, 5000));
              } else {
                await navigateToUrl(page, 'https://www.instagram.com/')
                await delay(getRandomIntBetween(3000, 5000));
              }
              countFollow++;
              logger("Follow " + countFollow + " person");
            } else {
              //back home
              let backEle = await getElement(page, 'nav header button[type="button"] [d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"]')
              if (!backEle) {
                backEle = await getElement(page, '[class="_abm0"] [d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"]')
                if (!backEle) {
                  backEle = await getElement(page, '[style="display: inline-block; transform: rotate(270deg);"] [d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"]')
                }
              }
              if (backEle) {
                await clickElement(backEle);
                await delay(getRandomIntBetween(3000, 5000));
              } else {
                await navigateToUrl(page, 'https://www.instagram.com/')
                await delay(getRandomIntBetween(3000, 5000));
              }
              i--;
              continue;
            }
          }
          logger("Complete follow by search keywords");
        } else {
          err["err"] = "Debug|Follow|You need import keywords into input search"
          return;
        }
      }
    } catch (error) {
      err["err"] = "Debug|Follow|Err click search " + error.message
      return;
    }
  };
  
  const searchByUser = async (page, userSearch) => {
    try {
      const inputSearchEle = await getElement(page, '[class="x6s0dn4 x78zum5 xdt5ytf x1c4vz4f xs83m0k xc9qbxq xjoudau x1n2onr6 xnf1dy1"] input');
      await delay(getRandomIntBetween(3000, 5000));
      if (!inputSearchEle) {
        logger("No have input to import");
        return false;
      }
      await inputSearchEle.type(userSearch, { delay: 200 });
      await delay(getRandomIntBetween(5000, 7000));
      const userSearchEle = await findBtn(
        page,
        userSearch,
        '[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli x1iyjqo2"]'
      );
      if (userSearchEle) {
        await userSearchEle.evaluate(b => b.click());
        await delay(getRandomIntBetween(3000, 5000));
        let followButtonEle = await getElement(
          page,
          '[type="button"] [dir="auto"]'
        );
        if (!followButtonEle) {
          followButtonEle = await getElement(
            page,
            'button[class=" _acan _acap _acaq _acas _aj1- _ap30"]'
          );
        }
        if (followButtonEle) {
          await clickElement(followButtonEle);
          await delay(getRandomIntBetween(3000, 5000));
          return true;
        } else {
          logger("No find follow button");
          return false;
        }
      } else {
        logger("No find person's search to follow");
        return false;
      }
    } catch (error) {
      logger("Err search by users " + error.message);
      return false;
    }
  };
  
  const searchByKey = async (page, userSearch) => {
    try {
      const inputSearchEle = await getElement(
        page,
        '[class="x6s0dn4 x78zum5 xdt5ytf x1c4vz4f xs83m0k xc9qbxq xjoudau x1n2onr6 xnf1dy1"] input'
      );
      if (!inputSearchEle) {
        logger("No have input to import");
        return false;
      }
      await inputSearchEle.type(userSearch, { delay: 200 });
      await delay(getRandomIntBetween(3000, 5000));
      const listKeywords = await getElements(
        page,
        '[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli x1iyjqo2"]'
      );
      if (listKeywords.length > 0) {
        const index = getRandomInt(listKeywords.length);
        await delay(getRandomIntBetween(3000, 5000));
        await listKeywords[index].evaluate(b => b.click());
        await delay(getRandomIntBetween(3000, 5000));
        let followButtonEle = await getElement(
          page,
          '[type="button"] [dir="auto"]'
        );
        if (!followButtonEle) {
          followButtonEle = await getElement(
            page,
            'button[class=" _acan _acap _acaq _acas _aj1- _ap30"]'
          );
        }

        if (followButtonEle) {
          await clickElement(followButtonEle);
          await delay(getRandomIntBetween(3000, 5000));
          return true;
        } else {
          logger("The user has been followed");
          return false;
        }
      } else {
        logger("No find person's search to follow");
        return false;
      }
    } catch (error) {
      logger("Err search by key " + error.message);
      return false;
    }
  };
  
  const selectorHref = async (page, namePage = "", indexHref) => {
    try {
      const href = await page.$$eval("a", links => links.map(a => a.href));
      if (href.length > 0) {
        const hrefPage = href.filter(e => e.includes(namePage));
        if (hrefPage.length > 0) {
          const index = indexHref ? indexHref : getRandomInt(hrefPage.length);
          const selector = '[href="'+hrefPage[index].replace(
            "https://www.instagram.com",
            ""
          )+'"]';
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
  
  const navigateToUrl = async (page, link) => {
    try {
      const url = await page.url();
      if (!url.includes(link)) {
        await page.goto(link, {
          waitUntil: "networkidle2",
        });
        await delay(getRandomIntBetween(1000, 3000));
      } else {
        logger("Debug|Follow|Can't navigate");
        return;
      }
    } catch (error) {
      logger("Debug|Follow|Error navigating to URL: " + error.message);
      return;
    }
  };
  
  const findBtn = async (page, content, selector) => {
    try {
      const buttons = await getElements(page, selector);
      for (let i = 0; i < buttons.length; i++) {
        const btn = await page.evaluate(el => {
          return el.innerHTML;
        }, buttons[i]);
        if (btn.includes(content)) {
          return buttons[i];
        }
      }
    } catch (err) {
      logger(err.message);
      return false;
    }
  };
  const scrollSmoothIfElementNotExistOnScreen1 = async (page, element, containerSelector) => {
    try {
      await page.evaluate(async (element, containerSelector) => {
        const getRandomIntBetween = (min, max) => {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const container = document.querySelector(containerSelector);
        if (!container) return;
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
        const isInViewport = (elem, container) => {
          const bounding = elem.getBoundingClientRect();
          return (
            bounding.top >= 100 &&
            bounding.left >= 0 &&
            bounding.bottom <=
              (container.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <=
              (container.innerWidth || document.documentElement.clientWidth)
          );
        };
        if (element && !isInViewport(element, container)) {
          const elementRect = element.getBoundingClientRect();
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
              getRandomIntBetween(100, 300) *
              (currentPosition > targetPosition ? -1 : 1);
            const durationPerStep = getRandomIntBetween(1000, 2000);
            const nextPosition = currentPosition + stepSize;
            smoothScrollByStep(nextPosition, durationPerStep, container);
            await delay(getRandomIntBetween(1000,2000));
            if(Math.random() < 0.3){
              await delay(getRandomIntBetween(3000,5000));
            }
            currentPosition = window.scrollTop;
          }
        }
      }, element, containerSelector);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
let followObj = ${strSetting};

try {
  const isLive = await checkIsLive(page);
  if (!isLive) {
    logger("Debug|Follow|Page is die");
    return;
  }
  await returnHomePage(page);
  await delay(2000);
  await turnOffNoti(page);
  await delay(2000);
  followObj = await checkObject(followObj);
  let errFollow = {};
  const numsFollow = getRandomIntBetween(
    followObj.numberStart,
    followObj.numberEnd
  );
  if (numsFollow < 1) {
    logger("Debug|Follow|Number of follow greater than one follow. you need to re-enter")
    return;
  }
  if (followObj.typeFollow === "followers") {
    const isAccessProfile = await accessProfile(page);
    if (isAccessProfile) {
      await delay(getRandomIntBetween(3000, 5000));
      await followByFollowers(page, numsFollow, errFollow);
      await delay(getRandomIntBetween(3000, 5000));
    } else {
      logger("Debug|Follow|Err access profile");
      return;
    }
  }
  if (followObj.typeFollow === "byUserLikePost") {
    if (followObj.postList.length < 1) {
      logger("Debug|Follow|Post ID is null. You need re-enter");
      return;
    }
    await followUserLikingPost(page, followObj.postList, numsFollow, errFollow);
    await delay(getRandomIntBetween(3000, 5000));
  }
  if (
    followObj.typeFollow === "byUserFollowing" ||
    followObj.typeFollow === "byUserFollower"
  ) {
    if (followObj.userList.length < 1) {
      logger("Debug|Follow|User ID is null. You need re-enter");
      return;
    }
    await followByUserFollowerOrFollowing(
      page,
      followObj.typeFollow,
      numsFollow,
      followObj.userList,
      errFollow
    );
    await delay(getRandomIntBetween(3000, 5000));
  }
  let arrSearchKey = followObj.searchByKeyword
  let arrSearchUser = followObj.searchByUser
  if(followObj.search === 'searchByKey') {
    if (arrSearchKey.length >= numsFollow) {
      arrSearchKey = arrSearchKey.sort(() => Math.random() - 0.5).slice(0, numsFollow)
    } else {
      while (arrSearchKey.length < numsFollow) {
        const indexRandom = getRandomInt(arrSearchKey.length)
        arrSearchKey.push(arrSearchKey[indexRandom]);
      }
    }
  }
  if(followObj.search === 'searchByUser') {
    if (arrSearchUser.length > numsFollow) {
      arrSearchUser = arrSearchUser.sort(() => Math.random() - 0.5).slice(0, numsFollow)
    }
  }
  if (followObj.typeFollow === "search") {
    await followBySearch(
      page,
      followObj.search,
      arrSearchUser,
      arrSearchKey,
      errFollow
    );
    await delay(getRandomIntBetween(3000, 5000));
  }
  if (errFollow.err != undefined) {
    logger(errFollow.err)
    return;
  }
  logger("Complete follow");
} catch (error) {
  logger("Debug|Follow|Err follow " + error.message);
  return;
}
  `;
};
