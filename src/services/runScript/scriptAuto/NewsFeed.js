export const newFeed = (setting) => {
  const strSetting = `
    {
      scrollTimeStart: ${setting.scrollTimeStart},
      scrollTimeEnd: ${setting.scrollTimeEnd},
      delayTimeStart: ${setting.delayTimeStart},
      delayTimeEnd: ${setting.delayTimeEnd},
      isLike: ${setting.isLike},
      likeStart: ${setting.likeStart},
      likeEnd: ${setting.likeEnd},
      isShare: ${setting.isShare},
      typeShare: ${JSON.stringify(setting.typeShare)},
      shareText: ${JSON.stringify(setting.shareText)},
      isComment: ${setting.isComment},
      commentText: ${JSON.stringify(setting.commentText)},
    }`;
  return `
  
  const randomLike = async (page, newsfeed, likeBtns, temp) => {
    try {
      let randomDelay = getRandomIntBetween(newsfeed.delayTimeStart * 1000, newsfeed.delayTimeEnd * 1000);
      if (likeBtns.length > 0) {
          const randomIndex = getRandomIntBetween(temp, likeBtns.length);
          logger(randomIndex)
          await scrollSmoothIfElementNotExistOnScreen(page,likeBtns[randomIndex]);
          await delay(randomDelay);
          temp = randomIndex;
          const rd = getRandomIntBetween(0,100);
          if(rd < 50){
             await clickElement(likeBtns[randomIndex])
          }
          else{
            return {
              isClick: false,
              newIndex: temp
            };
          }
          await delay(getRandomIntBetween(1000,3000));
      }
      return {
        isClick: true,
        newIndex: temp
      };
    } catch (error) {
      logger("Debug" + "|" + "NewsFeed" + "|" + "Like failed!");
      return false;
    }
  };
  const randomShare = async (page, newsfeed, shareBtns, temp) => {
    try {
      let randomDelay = getRandomIntBetween(newsfeed.delayTimeStart * 1000, newsfeed.delayTimeEnd * 1000);
      if (shareBtns.length > 0) {
        const randomIndex = getRandomIntBetween(temp, shareBtns.length);
        logger(randomIndex);
        await scrollSmoothIfElementNotExistOnScreen(page,shareBtns[randomIndex]);
         temp = randomIndex;
        await delay(1000);
              const rd = getRandomIntBetween(0,100);
          if(rd < 50){
              await clickElement(shareBtns[randomIndex])
          }
          else{
            return {
              isClick: false,
              newIndex: temp
            };
          }
      await delay(getRandomIntBetween(1000,3000));
          // choose share option
        const buttons = await getElements(page, '[class="native-text"]');
        for (let i = 0; i < buttons.length; i++) {
          const btn = await page.evaluate((el) => {
            return el.innerHTML;
          }, buttons[i]);
  
         if (btn.includes("󱤱")) {
            await clickElement(buttons[i]);
            break;
          }
        }
          await delay(1000);
          logger('Đã chọn option 1');
          // click post
          const postSelector = '#screen-root > div > div > div > div > div > div > button';
          const postBtn = await getElement(page, postSelector, 10);
          if (!postBtn) return {
            isClick: false,
            newIndex: temp
          };
          await delay(1000);
          await clickElement(postBtn);
          await delay(randomDelay);
          logger('Đã share xong');
      }
      return {
        isClick: true,
        newIndex: temp
      };
    } catch (error) {
     logger("Debug" + "|" + "NewsFeed" + "|" + "Sharing failed!");
     return false;
    }
  };
  const randomComment = async (page, newsfeed, commentBtns, temp) => {
    try {
    let randomDelay = getRandomIntBetween(newsfeed.delayTimeStart * 1000, newsfeed.delayTimeEnd * 1000);
    let isClick = false;
    if (commentBtns.length > 0) {
      const randomIndex = getRandomIntBetween(temp, commentBtns.length);
      logger(randomIndex);
      await scrollSmoothIfElementNotExistOnScreen(commentBtns[randomIndex]);
      await delay(1000);
      temp = randomIndex;
      const rd = getRandomIntBetween(0,100);
          if(rd < 50){
             await clickElement(commentBtns[randomIndex]);
          }
          else{
            return {
              isClick: false,
              newIndex: temp
            };
          }
      await delay(getRandomIntBetween(1000,3000));
        // find comment area
        const commentAreaSelector = 'textarea[type="text"]';
        const commentArea = await getElement(page, commentAreaSelector, 10);
        if (!commentArea) return {
          isClick: isClick,
          newIndex: temp
        };
        await delay(1000);
        await clickElement(commentArea);
        logger('Đã chọn vùng comment');
        // comment
        let content = newsfeed.commentStrs;
        let randomString = content[getRandomInt(content.length)];
        await delay(2000);
        await page.keyboard.type(randomString, { delay: 100 });
        await delay(2000);
        const postBtn = await findBtn(page, "󱛅");
        if (!postBtn || postBtn.length == 0) {
                return {
                  isClick: isClick,
                  newIndex: temp
                };
          };
        
        await delay(2000);
        await clickElement(postBtn[0]);
        await delay(randomDelay);
        // return home
        const returnSelector = '#screen-root > div > div > div > div > div.m.bg-s3 > div:nth-child(1)';
        const returnBtn = await getElement(page, returnSelector, 10);
        if (!returnBtn) return {
          isClick: isClick,
          newIndex: temp
        };
        await delay(2000);
        await clickElement(returnBtn);
        isClick = true;
        await delay(3000);
    }

     return {
      isClick: isClick,
      newIndex: temp
    };
    } catch (error) {
     logger("Debug" + "|" + "NewsFeed" + "|" + "Comment failed!");
     return false;
    }
  };
const findBtns = async (page, content) => {
  try {
    if (content === "like") {
      let buttons = await getElements(
        page,
        'section [d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"]'
      );
      return buttons;
    }
  } catch (err) {
    logger(err);
  }
};
const newsfeed = ${strSetting};
try {
  //Check obj start < end ? random(start,end) : random(end,start)
  let news = await checkObject(newsfeed);
  // check page is live return -1, return 1, return 0
  const isLive = checkIsLive(page);
  logger('Tình trạng trang web: '+ isLive);
  if (!isLive) {
    logger("Debug" + "|" + "NewsFeed" + "|" + "Page is dead!");
    return -1;
  }

  let randomDelay = getRandomIntBetween(newsfeed.delayTimeStart * 1000, newsfeed.delayTimeEnd * 1000);
  let scrollTime = getRandomIntBetween(newsfeed.scrollTimeStart * 1000, newsfeed.scrollTimeEnd * 1000);
  logger("scroll time " + scrollTime);
  let loopLike = 0;
  let loopComment = 0;
  let loopShare = 0;
  while (scrollTime > 0) {
    try{
    let startTime = Date.now();
    await returnHomePage(page);
    await delay(2000);
    await scrollSmooth(page,1);
    
    if (news.isLike == true && loopLike == 0) {
      let count = 0;
      let numLikes = getRandomIntBetween(news.likeStart, news.likeEnd);
      logger('Cần like ' + numLikes + ' bài');
      let temp = 0;
      for (let i = 0; i < numLikes * 2; i++) {
        try {
          await returnHomePage(page);
          await delay(2000);
          let likeBtns = await findBtns(page, "like");
          await delay(1000);
          if (likeBtns.length == 0 || !likeBtns) {
            logger("không tìm thấy nút thả tim");
            break;
          }
          logger("có " + likeBtns.length + " nút like")
          const objLike = await randomLike(page, news, likeBtns,temp);
          if (objLike.isClick) {
            count++;
            logger('Đã like được '+ count + ' bài');
          } else {
            logger('Xem bài viết thành công');
            i--;
          }
          if (count == numLikes) {
            logger('Xong like !');
            loopLike++;
            break;
          }
          temp = objLike.newIndex
          await delay(randomDelay);
        } catch (error) {
         logger(error);
        }
      }
    }

    if (news.randomShare == true && loopShare == 0) {
      let count = 0;
      let numShares = getRandomIntBetween(news.shareStart, news.shareEnd);
      logger('Cần share ' + numShares + ' bài');
      const homeSelector2 =
      "#screen-root > div > div:nth-child(1) > div:nth-child(4) > div:nth-child(1)";
      if( await checkExistElementOnScreen(page,homeSelector2) != 0) {
        await page.goto("https://m.facebook.com/");
      }
      await delay(3000);
      let temp = 2;
      for (let i = 0; i < numShares * 2; i++) {
        try {
          let shareBtns = await findBtn(page, "󰍺");
          if (!shareBtns || shareBtns.length == 0) {
            shareBtns = await findBtn(page, "󰤧");
             if (!shareBtns || shareBtns.length == 0) {
              logger("Debug" + "|" + "NewsFeed" + "|" + "Can not find any share buttons");
              break;
             }
          };
          logger("có " + shareBtns.length + " nút share")
          await returnHomePage(page);
          const result = await randomShare(page, news, shareBtns, temp);
          if (result.isClick) {
            count++;
            logger('Đã share được ' + count + ' bài');
          } else {
            logger('Xem bài viết thành công');
            i--;
          }
          if (count == numShares) {
            logger('Xong share!');
            loopShare++;
            break;
          }
          temp = result.newIndex;
          await delay(randomDelay);
        } catch (error) {
          logger(error);
        }
      }
    }

    if (news.randomComment == true && loopComment == 0) {
      if (!news.commentStrs.length) {
        logger("Debug" + "|" + "NewsFeed" + "|" + "Cannot comment with empty content!");
        return false;
      }
      const homeSelector1 =
      "#screen-root > div > div:nth-child(1) > div:nth-child(4) > div:nth-child(1)";
      if( await checkExistElementOnScreen(page,homeSelector1) != 0) {
        await page.goto("https://m.facebook.com/");
      }
      await delay(3000);
      const numComments = getRandomIntBetween(news.commentStart, news.commentEnd);
      logger('Cần comment '+  numComments + ' bài');
      let count = 0;
      let temp = 1;
      for (let i = 0; i < numComments * 2; i++) {
        try {
          await returnHomePage(page);
          let commentBtns = await findBtn(page, "󰍹");
          if (!commentBtns || commentBtns.length == 0) {
            commentBtns = await findBtn(page, "󰤦");
             if (!commentBtns || commentBtns.length == 0) {
              logger("Debug" + "|" + "NewsFeed" + "|" + "Can not find any comment buttons");
              return false;
             }
          };
          logger("có " + commentBtns.length + " nút comment");
          const result = await randomComment(page, news, commentBtns, temp);
          await delay(randomDelay);
          if (result.isClick) {
            count++;
            logger('Đã comment được ' + count + ' bài');
          } else {
            logger('Xem bài viết thành công !');
            i--;
          }
          if (count == numComments) {
            logger('Xong comment!');
            loopComment++;
            break;
          }
          temp = result.newIndex;
          await delay(randomDelay);
        } catch (error) {
          logger(error);
        }
      }
      logger('end');
    }
    if(news.randomLike == false && news.randomShare == false && news.randomComment == false) {
        await returnHomePage(page);
        await delay(1000);
        const result =  await scrollSmooth(page, 3);
        if(result == -2){
          break;
        }
        if(Math.random() < 0.3){
          await delay(randomDelay);
        }
    }
    let endTime = Date.now();
    scrollTime -= endTime - startTime;
  }
  catch(e){
    scrollTime = 0;
    break;
  }
  }
} catch (err) {
  logger(err);
}
    `;
};
