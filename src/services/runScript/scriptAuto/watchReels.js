export const watchReels = (setting) => {
  const strSetting = `
      {
        videoStart: ${setting.videoStart},
        videoEnd: ${setting.videoEnd},
        delayTimeStart: ${setting.delayTimeStart},
        delayTimeEnd: ${setting.delayTimeEnd},
        isLike: ${setting.isLike},
        likeStart: ${setting.likeStart},
        likeEnd: ${setting.likeEnd},
        isShare: ${setting.isShare},
        shareStart: ${setting.shareStart},
        shareEnd: ${setting.shareEnd},
        typeShare: ${JSON.stringify(setting.typeShare)},
        shareText: ${JSON.stringify(setting.shareText)},
        userList: ${JSON.stringify(setting.userList)},
        isComment: ${setting.isComment},
        typeComment: ${JSON.stringify(setting.typeComment)},
        commentText: ${JSON.stringify(setting.commentText)},
        commentStart: ${setting.commentStart},
        commentEnd: ${setting.commentEnd},
        isMessage: ${setting.isMessage},
        
      }`;
  console.log(strSetting);
  return `
  const checkUrlPage = async (page, urlText) => {
    try {
      const url = page.url();
      if (url.includes(urlText)) return true;
      return false;
    } catch (error) {
      logger(error.message);
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
  const scrollSmoothIfNotExistOnScreen1 = async element => {
    try {
      const isExistElementOnScreen = await checkExistElementOnScreen1(element);
      if (!isExistElementOnScreen) {
        await element.evaluate(el => {
          el.scrollIntoView({
            behavior: "smooth",
            inline: "nearest",
            block: "center",
          });
        });
        await delay(getRandomIntBetween(3000, 5000));
        return true;
      }
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const checkExistElementOnScreen1 = async element => {
    try {
      const isElementVisible = await element.evaluate(el => {
        const { top, left, bottom, right } = el.getBoundingClientRect();
        return (
          top >= 0 &&
          left >= 0 &&
          bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      });
      return isElementVisible;
    } catch (error) {
      return false;
    }
  };
  const accessReels = async page => {
    try {
      let reelsEle = await getElement(
        page,
        '[d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.91.91 0 0 1-.91 0Z"]'
      );
      if (!reelsEle) {
        reelsEle = await selectorHref(page, "/reels/", 0);
      }
      await delay(getRandomIntBetween(3000, 5000));
      if (reelsEle) {
        await clickElement(reelsEle);
        await delay(getRandomIntBetween(3000, 5000));
        const isUrlReel = await checkUrlPage(page, "instagram.com/reels/");
        await delay(getRandomIntBetween(3000, 5000));
        if (!isUrlReel) {
          await navigateToUrl(page, "https://www.instagram.com/reels/");
        }
      } else {
        await navigateToUrl(page, "https://www.instagram.com/reels/");
        await delay(getRandomIntBetween(3000, 5000));
      }
      return true;
    } catch (error) {
      logger("Err access reels " + error.message);
      return false;
    }
  };
  
  const actionWatchReels = async (
    page,
    numsReels,
    arrLike,
    arrComment,
    arrShare,
    watchReelsObj
  ) => {
    try {
      const watchReelsTime =
        getRandomIntBetween(
          watchReelsObj.delayTimeStart,
          watchReelsObj.delayTimeEnd
        ) * 1000;
      let countLike = 0;
      let countComment = 0;
      let countShare = 0;
      for (let i = 0; i < numsReels; i++) {
        await delay(watchReelsTime);
        logger("Done view reels");
        if (watchReelsObj.isLike && arrLike.includes(i)) {
          const isLike = await likeReels(page, i);
          await delay(getRandomIntBetween(3000, 5000));
          if (isLike) {
            countLike++;
            logger("Like " + countLike + " reels");
          } else {
            //next reels
            await page.keyboard.down("PageDown");
            await delay(getRandomIntBetween(3000, 5000));
            continue;

          }
        }
        if (watchReelsObj.isComment && arrComment.includes(i)) {
          const isComment = await commentReels(page, watchReelsObj, i);
          await delay(getRandomIntBetween(3000, 5000));
          if (isComment) {
            countComment++;
            logger("Comment " + countComment + " reels");
          } else {
            //next reels
            await page.keyboard.down("PageDown");
            await delay(getRandomIntBetween(3000, 5000));
            continue;
          }
        }
        if (watchReelsObj.isShare && arrShare.includes(i)) {
          const isShare = await shareReels(page, watchReelsObj, i);
          await delay(getRandomIntBetween(3000, 5000));
          if (isShare) {
            countShare++;
            logger("Share " + countShare + " reels");
          } else {
            //next reels
            await page.keyboard.down("PageDown");
            await delay(getRandomIntBetween(3000, 5000));
            continue;
          }
        }
        //next reels
      await page.keyboard.down("PageDown");
      await delay(getRandomIntBetween(3000, 5000));
      }
      logger("Complete watch reels");
    } catch (error) {
      logger("Debug|WatchReels|Err watch reels " + error.message);
      return;
    }
  };
  
  const likeReels = async (page, index) => {
    try {
      const reelsEle = await getElements(page, "div.xgv127d");
      if (!reelsEle) {
        logger("NO find reels element")
        return false;
      }
      await delay(getRandomIntBetween(3000, 5000));
      let likedEle = await reelsEle[index].$(
        '[d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"]'
      );
      if (!likedEle) {
        likedEle = await reelsEle[index].$('[class="x1lliihq x1n2onr6 xxk16z8"]');
      }
      if (likedEle) {
        logger("Liked this post");
        return true;
      } else {
        let likeEle = await reelsEle[index].$(
          '[d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"]'
        );
        if (!likeEle) {
          likeEle = await reelsEle[index].$(
            'span [class="x1lliihq x1n2onr6 xyb1xck"]'
          );
        }
        if (likeEle) {
          await clickElement(likeEle);
          await delay(getRandomIntBetween(3000, 5000));
          logger("Like reel success");
          return true;
        } else {
          logger("Can not find like element");
          return false;
        }
      }
    } catch (error) {
      logger("Err like reels" + error.message);
      return false;
    }
  };
  
  const commentReels = async (page, watchReelsObj, index) => {
    try {
      if (watchReelsObj.commentText.length > 0) {
        const reelsEle = await getElements(page, "div.xgv127d");
        if (!reelsEle) {
          logger("NO find reels element")
          return false;
        }
        await delay(getRandomIntBetween(3000, 5000));
        const contentComment =
          watchReelsObj.commentText[
            getRandomInt(watchReelsObj.commentText.length)
          ];
        let commentEle = await reelsEle[index].$(
          '[d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"]'
        );
        await delay(getRandomIntBetween(3000, 5000));
        if (commentEle) {
          await clickElement(commentEle);
          await delay(getRandomIntBetween(3000, 5000));
          let importComment = await getElement(
            page,
            '[class="x6s0dn4 x78zum5 x6ikm8r x1rife3k x1n2onr6 xh8yej3 xxk0z11 x101qyy3"] input'
          );
          if (!importComment) {
            importComment = await getElement(
              page,
              '[class="xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee xw2csxc x1odjw0f x1n2onr6 x1hnll1o xs3hnx8 x1db89rt xyfr5zc x7xwk5j xpqswwc xl565be x5dp1im xdj266r x11i5rnm xat24cr x1mh8g0r x1ye3gou xn6708d x5n08af xh8yej3 x13faqbe"]'
            );
          }
          await delay(getRandomIntBetween(1000, 3000));
          if (importComment) {
            await importComment.type(contentComment, { delay: 200 });
            await delay(getRandomIntBetween(1000, 3000));
            await page.keyboard.press("Enter");
            await delay(getRandomIntBetween(5000, 7000));
            //close
          const closeEle = await getElement(
            page,
            '[class="x6s0dn4 x78zum5 xdt5ytf xl56j7k"] [class="x1lliihq x1n2onr6 x5n08af"] line'
          );
          if (closeEle) {
            await clickElement(closeEle);
            await delay(getRandomIntBetween(3000, 5000));
          }
            logger("Comment post success");
            return true;
          }
        } else {
          logger("Can not find comment element");
          return false;
        }
      } else {
        logger("Not content comment");
        return false;
      }
    } catch (error) {
      logger("Err comment reels " + error.message);
      return false;
    }
  };
  
  const shareReels = async (page, watchReelsObj, index) => {
    try {
      const reelsEle = await getElements(page, "div.xgv127d");
      if (!reelsEle) {
        logger("NO find reels element")
        return false;
      }
      await delay(getRandomIntBetween(3000, 5000));
      //select and click button share
      let shareEle = await reelsEle[index].$(
        '[points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"]'
      );
      if (watchReelsObj.typeShare === "user") {
        if (shareEle && watchReelsObj.userList.length > 0) {
          const userShare =
            watchReelsObj.userList[getRandomInt(watchReelsObj.userList.length)];
          await scrollSmoothIfNotExistOnScreen1(shareEle);
          await clickElement(shareEle);
          await delay(getRandomIntBetween(3000, 5000));
          //search user and click user need share
          const searchUserShare = await getElement(
            page,
            'input[name="queryBox"]'
          );
          if (!searchUserShare) {
            logger("Can not find search input");
            return false;
          }
          await searchUserShare.type(userShare, { delay: 200 });
          await delay(getRandomIntBetween(3000, 5000));
          const selectUserEle = await getElement(
            page,
            'input[name="ContactSearchResultCheckbox"]'
          );
          let closeEle = await getElement(
            page,
            '[class="x6s0dn4 x78zum5 xdt5ytf xl56j7k"] [class="x1lliihq x1n2onr6 x5n08af"] line'
          );
          if (selectUserEle) {
            await clickElement(selectUserEle);
            await delay(getRandomIntBetween(3000, 5000));
            // import content share
            if (watchReelsObj.isMessage && watchReelsObj.shareText.length > 0) {
              const contentShare =
                watchReelsObj.shareText[
                  getRandomInt(watchReelsObj.shareText.length)
                ];
              const importShareEle = await getElement(
                page,
                'input[name="shareCommentText"]'
              );
              await delay(getRandomIntBetween(3000, 5000));
              await importShareEle.type(contentShare, { delay: 200 });
              await delay(getRandomIntBetween(3000, 5000));
            }
            //send share post
            let sendButtonEle = await getElement(
              page,
              '[class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x18d9i69 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x9bdzbf x1ypdohk x1f6kntn xwhw2v2 x10w6t97 xl56j7k x17ydfre x1swvt13 x1pi30zi x1n2onr6 x2b8uid xlyipyv x87ps6o xcdnw81 x1i0vuye xh8yej3 x1tu34mt xzloghq x3nfvp2"]'
            );
            if (!sendButtonEle) {
              sendButtonEle = await getElement(
                page,
                '[class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh xktsk01 x1yztbdb x1d52u69 xdj266r x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1"]'
              );
            }
            if (sendButtonEle) {
              await clickElement(sendButtonEle);
              await delay(getRandomIntBetween(3000, 5000));
              logger("Share post success");
              return true;
            } else {
              await clickElement(closeEle);
              await delay(getRandomIntBetween(3000, 5000));
              logger("No send share post interaction");
              return false;
            }
          } else {
            await clickElement(closeEle);
            await delay(getRandomIntBetween(3000, 5000));
            logger("No find user to share");
            return true;
          }
        } else {
          logger("Can not find share button or user list none");
          return true;
        }
      }
      if (watchReelsObj.typeShare === "suggested") {
        const reelsEle = await getElements(page, "div.xgv127d");
        if (!reelsEle) {
          logger("NO find reels element")
          return false;
        }
        await delay(getRandomIntBetween(1000, 3000));
        //select and click button share
        let shareEle = await reelsEle[index].$(
          '[points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"]'
        );
        if (shareEle) {
          await scrollSmoothIfNotExistOnScreen1(shareEle);
          await clickElement(shareEle);
          await delay(getRandomIntBetween(1000, 3000));
          //select user need share
          const selectUserEle = await getElements(
            page,
            'input[name="ContactSearchResultCheckbox"]'
          );
          const closeEle = await getElement(
            page,
            '[class="x6s0dn4 x78zum5 xdt5ytf xl56j7k"] [class="x1lliihq x1n2onr6 x5n08af"] line'
          );
          if (selectUserEle.length > 0) {
            const index = getRandomInt(selectUserEle.length);
            const container = await getElement(page, '[class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1pi30zi x1swvt13 x1uhb9sk x6ikm8r x1rife3k x1iyjqo2 x2lwn1j xeuugli xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1"]')
            if (container) {
              await testScroll(page, selectUserEle[index], container);
              await delay(getRandomIntBetween(3000, 5000));
            }
            await clickElement(selectUserEle[index]);
            await delay(getRandomIntBetween(1000, 3000));
            // import content share
            if (watchReelsObj.isMessage && watchReelsObj.shareText.length > 0) {
              const contentShare =
                watchReelsObj.shareText[
                  getRandomInt(watchReelsObj.shareText.length)
                ];
              const importShareEle = await getElement(
                page,
                'input[name="shareCommentText"]'
              );
              await delay(getRandomIntBetween(3000, 5000));
              await importShareEle.type(contentShare, { delay: 200 });
              await delay(getRandomIntBetween(3000, 5000));
            }
            //send share post
            let sendButtonEle = await getElement(
              page,
              '[class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x18d9i69 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x9bdzbf x1ypdohk x1f6kntn xwhw2v2 x10w6t97 xl56j7k x17ydfre x1swvt13 x1pi30zi x1n2onr6 x2b8uid xlyipyv x87ps6o xcdnw81 x1i0vuye xh8yej3 x1tu34mt xzloghq x3nfvp2"]'
            );
            if (!sendButtonEle) {
              sendButtonEle = await getElement(
                page,
                '[class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh xktsk01 x1yztbdb x1d52u69 xdj266r x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1"]'
              );
            }
            if (sendButtonEle) {
              await clickElement(sendButtonEle);
              await delay(getRandomIntBetween(1000, 3000));
              logger("Share post success");
              return true;
            } else {
              await clickElement(closeEle);
              await delay(getRandomIntBetween(3000, 5000));
              logger("No send share post interaction");
              return false;
            }
          } else {
            if (shareEle && watchReelsObj.userList.length > 0) {
              const userShare =
                watchReelsObj.userList[getRandomInt(watchReelsObj.userList.length)];
              await scrollSmoothIfNotExistOnScreen1(shareEle);
              await clickElement(shareEle);
              await delay(getRandomIntBetween(3000, 5000));
              //search user and click user need share
              const searchUserShare = await getElement(
                page,
                'input[name="queryBox"]'
              );
              if (!searchUserShare) {
                logger("Can not find search input");
                return false;
              }
              await searchUserShare.type(userShare, { delay: 200 });
              await delay(getRandomIntBetween(3000, 5000));
              const selectUserEle = await getElement(
                page,
                'input[name="ContactSearchResultCheckbox"]'
              );
              let closeEle = await getElement(
                page,
                '[class="x6s0dn4 x78zum5 xdt5ytf xl56j7k"] [class="x1lliihq x1n2onr6 x5n08af"] line'
              );
              if (selectUserEle) {
                await clickElement(selectUserEle);
                await delay(getRandomIntBetween(3000, 5000));
                // import content share
                if (watchReelsObj.isMessage && watchReelsObj.shareText.length > 0) {
                  const contentShare =
                    watchReelsObj.shareText[
                      getRandomInt(watchReelsObj.shareText.length)
                    ];
                  const importShareEle = await getElement(
                    page,
                    'input[name="shareCommentText"]'
                  );
                  await delay(getRandomIntBetween(3000, 5000));
                  await importShareEle.type(contentShare, { delay: 200 });
                  await delay(getRandomIntBetween(3000, 5000));
                }
                //send share post
                let sendButtonEle = await getElement(
                  page,
                  '[class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x18d9i69 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x9bdzbf x1ypdohk x1f6kntn xwhw2v2 x10w6t97 xl56j7k x17ydfre x1swvt13 x1pi30zi x1n2onr6 x2b8uid xlyipyv x87ps6o xcdnw81 x1i0vuye xh8yej3 x1tu34mt xzloghq x3nfvp2"]'
                );
                if (!sendButtonEle) {
                  sendButtonEle = await getElement(
                    page,
                    '[class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh xktsk01 x1yztbdb x1d52u69 xdj266r x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1"]'
                  );
                }
                if (sendButtonEle) {
                  await clickElement(sendButtonEle);
                  await delay(getRandomIntBetween(3000, 5000));
                  logger("Share post success");
                  return true;
                } else {
                  await clickElement(closeEle);
                  await delay(getRandomIntBetween(3000, 5000));
                  logger("No send share post interaction");
                  return false;
                }
              } else {
                await clickElement(closeEle);
                await delay(getRandomIntBetween(3000, 5000));
                logger("No find user to share");
                return true;
              }
            }
          }
        } else {
          logger("Can not find share button or user list none");
          return true;
        }
      }
    } catch (error) {
      logger("Err share post " + error.message);
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
      } else {
        logger("Debug|WatchReels|Can't navigate");
        return;
      }
    } catch (error) {
      logger("Debug|WatchReels|Error navigating to URL: " + error.message);
      return;
    }
  };
  
  let watchReelsObj = ${strSetting}
  try {
    const isLive = await checkIsLive(page);
    if (!isLive) {
      logger("Page is die");
      return;
    }
    await returnHomePage(page);
    await delay(getRandomIntBetween(3000, 5000));
    await turnOffNoti(page);
    watchReelsObj = await checkObject(watchReelsObj);
    const numsReels = getRandomIntBetween(
      watchReelsObj.videoStart,
      watchReelsObj.videoEnd
    );

    if (numsReels < 1) {
      logger("Debug|WatchReels|Number of reels less than 1. You need re-enter")
      return;
    }
    let arrLike = [];
    let arrComment = [];
    let arrShare = [];
    let numsLike = getRandomIntBetween(
      watchReelsObj.likeStart,
      watchReelsObj.likeEnd
    );
    let numsComment = getRandomIntBetween(
      watchReelsObj.commentStart,
      watchReelsObj.commentEnd
    );
    let numsShare = getRandomIntBetween(
      watchReelsObj.shareStart,
      watchReelsObj.shareEnd
    );

    if(watchReelsObj.isLike) {
      if (numsLike < numsReels) {
        while (numsLike > 0) {
          const index = getRandomIntBetween(0, numsReels);
          if (arrLike.includes(index)) {
            continue;
          }
          arrLike.push(index);
          numsLike--;
        }
      } else {
        for (let i = 0; i < numsReels; i++) {
          arrLike.push(i);
        }
      }
      logger("Need like " + arrLike.length + " reels");
    }

    if(watchReelsObj.isComment) {
      if (numsComment < numsReels) {
        while (numsComment > 0) {
          const index = getRandomIntBetween(0, numsReels);
          if (arrComment.includes(index)) {
            continue;
          }
          arrComment.push(index);
          numsComment--;
        }
      } else {
        for (let i = 0; i < numsReels; i++) {
          arrComment.push(i);
        }
      }
      logger("Need comment " + arrComment.length + " reels");
    }

    if(watchReelsObj.isShare) {
      if (numsShare < numsReels) {
        while (numsShare > 0) {
          const index = getRandomIntBetween(0, numsReels);
          if (arrComment.includes(index)) {
            continue;
          }
          arrShare.push(index);
          numsShare--;
        }
      } else {
        for (let i = 0; i < numsReels; i++) {
          arrShare.push(i);
        }
      }
      logger("Need share " + arrShare.length + " reels");
    }
    await delay(getRandomIntBetween(3000, 5000));
    const isAccess = await accessReels(page);
    await delay(getRandomIntBetween(3000, 5000));
    if (isAccess) {
      await actionWatchReels(
        page,
        numsReels,
        arrLike,
        arrComment,
        arrShare,
        watchReelsObj
      );
    } else {
      logger("Debug|WatchReels|Err access reels");
      return;
    }
  } catch (error) {
    logger("Debug|WatchReels|Err watch reels " + error.message);
    return;
  }
    `;
};
