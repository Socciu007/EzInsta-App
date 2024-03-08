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
      shareStart: ${setting.shareStart},
      shareEnd: ${setting.shareEnd},
      userStart: ${setting.userStart},
      userEnd: ${setting.userEnd},
      message: ${JSON.stringify(setting.message)},
      isMessage:  ${setting.isMessage},
      typeShare: ${JSON.stringify(setting.typeShare)},
      shareText: ${JSON.stringify(setting.shareText)},
      isComment: ${setting.isComment},
      commentStart: ${setting.commentStart},
      commentEnd: ${setting.commentEnd},
      commentText: ${JSON.stringify(setting.commentText)},
    }`;
  console.log(strSetting);
  return `
const randomShare = async (page) => {
  const radioBtns = await findBtns(page, "radio");
  if (!radioBtns || radioBtns.length == 0) {
    logger("Can not find any radio buttons")
    return false;
  }
  let randomIndex = getRandomInt(radioBtns.length);
  await scrollSmoothIfElementNotExistOnScreen(page, radioBtns[randomIndex]);
  await delay(2000);
  await radioBtns[randomIndex].click();
  await delay(2000);
  const sendBtns = await findBtns(page, "send");
  if (!sendBtns || sendBtns.length == 0) {
    logger("Can not find any send buttons")
    return false;
  }
  await sendBtns[sendBtns.length - 1].click();
  await delay(3000);
  return true;
  
} 
const userShare = async (page, news) => {
  const search = await getElement(page, '[name="queryBox"]');
  if(!search) {
    logger("Can not find search button")
    return false;
  }
  await search.click();
  await delay(2000);
  let content = news.shareText;
  let randomString = content[getRandomInt(content.length)];
  await delay(2000);
  await page.keyboard.type(randomString, { delay: 100 });
  await delay(5000);
  const numsUser = getRandomIntBetween(news.userStart, news.userEnd);
  logger("Cần gửi cho " + numsUser + " người");
  await delay(3000);
  const radioBtns = await findBtns(page, "radio");
  if (!radioBtns || radioBtns.length == 0) {
    logger("Can not find any radio buttons")
    return false;
  }
  if(radioBtns.length < numsUser) {
    numsUser = radioBtns.length;
  }
  let arr = [];
  for(let i = 0; i < numsUser; i++){
    let randomIndex = getRandomInt(radioBtns.length);
    if(arr.indexOf(randomIndex) == -1) {
      arr.push(randomIndex);
    } else {
      i--;
    }
    await scrollSmoothIfElementNotExistOnScreen(page, radioBtns[randomIndex]);
    await delay(2000);
    await radioBtns[randomIndex].click();
    await delay(2000);
  }
  
  if(news.isMessage == true) {
    const messageArea = await getElement(page, '[name="shareCommentText"]');
    if(!messageArea) {
      logger("Không tìm thấy vùng ghi lời nhắn");
      return false;
    }
    await delay(2000);
    await messageArea.click();
    await delay(2000);
    let message = news.message;
    let randomString = message[getRandomInt(message.length)];
    await delay(2000);
    await page.keyboard.type(randomString, { delay: 100 });
    await delay(2000);
  }
  const sendBtns = await findBtns(page, "send");
  if (!sendBtns || sendBtns.length == 0) {
    logger("Can not find any send buttons")
    return false;
  }
  await delay(2000);
  await sendBtns[sendBtns.length - 1].click();
  await delay(3000);
  return true;
  
} 
const findBtns = async (page, content) => {
  try {
    if (content === "like") {
      let buttons = await getElements(
        page,
        'span [d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"]'
      );
      return buttons;
    }
    if (content === "comment") {
      let buttons = await getElements(
        page,
        'textarea'
      );
      return buttons;
    }
    let arr = [];
    if (content === "share") {
      let buttons = await getElements(
        page,
        '[points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"]'
      );
      for (let i = 1; i <= buttons.length; i++) {
        if(i%2 == 0){
          arr.push(buttons[i-1]);
        }
      }
      return arr;
    }
    if(content === "radio") {
      let buttons = await getElements(
        page,
        '[type="checkbox"]'
      );
      return buttons;
    }
    if(content === "send") {
      let buttons = await getElements(
        page,
        'div[role="button"]'
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
  let loopLike = 0;
  let loopComment = 0;
  let loopShare = 0;
  // await delay(999999999);
  while (scrollTime > 0) {
    try{
    let startTime = Date.now();
    await returnHomePage(page);
    await delay(2000);
    await scrollSmooth(page,1);
    await delay(1000);
    if (news.isLike == true && loopLike == 0) {
      let count = 0;
      let numLikes = getRandomIntBetween(news.likeStart, news.likeEnd);
      logger('Cần like ' + numLikes + ' bài');
      for (let i = 0; i < numLikes * 2; i++) {
        try {
          let temp = 0;
          await returnHomePage(page);
          await delay(2000);
          await scrollSmooth(page,getRandomIntBetween(1,5));
          await delay(2000);
          let likeBtns = await findBtns(page, "like");
          await delay(1000);
          if (likeBtns.length == 0 || !likeBtns) {
            logger("Debug" + "|" + "NewsFeed" + "|" + "Can not find any like buttons");
            break;
          }
          for(let i=0;i<likeBtns.length - 1;i++){
            const onScreen = await checkExistElementOnScreen(likeBtns[i]);
            if(onScreen == 0){
              const rd = getRandomIntBetween(0,100);
              if(rd < 50){
                await delay(randomDelay);
                await scrollSmoothIfElementNotExistOnScreen(page, likeBtns[i]);
                await delay(1000);
                await likeBtns[i].click();
                await delay(2000);
                count++;
                logger("Like thành công " + count + " bài")
                break;
              } else {
                temp = 1;
                break;
              }
            }
          }
          if(temp == 1){
            i--;
            logger("Xem bài viết thành công");
          }
          if(count == numLikes){
              logger('Xong like !');
              loopLike++;
              await delay(3000);
              break;
          }
        } catch (error) {
         logger(error);
        }
      }
    }

    if (news.isShare == true && loopShare == 0) {
      let count = 0;
      let numShares = getRandomIntBetween(news.shareStart, news.shareEnd);
      logger('Cần share ' + numShares + ' bài');
      for (let i = 0; i < numShares * 2; i++) {
        try {
          let temp = 0;
          await returnHomePage(page);
          await delay(2000);
          await scrollSmooth(page,getRandomIntBetween(1,5));
          await delay(2000);
          let shareBtns = await findBtns(page, "share");
          if (!shareBtns || shareBtns.length == 0) {
              logger("Debug" + "|" + "NewsFeed" + "|" + "Can not find any share buttons");
              break;
          };
          for(let i = 0 ; i <  shareBtns.length; i++) {
            const onScreen = await checkExistElementOnScreen(shareBtns[i]);
            if(onScreen == 0){
              const rd = getRandomIntBetween(0,100);
              if(rd < 50){
                await delay(randomDelay);
                await scrollSmoothIfElementNotExistOnScreen(page, shareBtns[i]);
                await delay(1000);
                await shareBtns[i].click();
                await delay(2000);
                if(news.typeShare == "randomShare"){
                  const isShare = await randomShare(page);
                  if(isShare) {
                    count++;
                    logger("Share thành công " + count + " bài");
                    break;
                  } else {
                    const closeBtn = await getElement(page, "polyline");
                    if(!closeBtn) {
                      await page.goto("https://www.instagram.com", {
                      waitUntil: 'networkidle2',
                      timeout: 30000,
                      })
                    }
                    await delay(2000);
                    await closeBtn.click();
                    await delay(2000);
                    temp = 1;
                  }
                }
                if(news.typeShare == "user"){
                  const isShare = await userShare(page, news);
                  if(isShare) {
                    await delay(2000);
                    count++;
                    logger("Share thành công " + count + " bài");
                    break;
                  } else {
                    const closeBtn = await getElement(page, "polyline");
                    if(!closeBtn) {
                      await page.goto("https://www.instagram.com", {
                      waitUntil: 'networkidle2',
                      timeout: 60000,
                      })
                    }
                    await delay(2000);
                    await closeBtn.click();
                    await delay(2000);
                    temp = 1;
                  }
                }
              } else {
                temp = 1;
                break;
              }
            }
          }
          if(temp == 1){
            logger("Xem bài viết thành công");
            await delay(2000);
            i--;
          }
          if (count == numShares) {
            logger('Xong share!');
            loopShare++;
            await delay(3000);
            break;
          }
        } catch (error) {
          logger(error);
        }
      }
    }

if (news.isComment == true && loopComment == 0) {
  if (!news.commentText.length) {
    logger(
      "Debug" + "|" + "NewsFeed" + "|" + "Cannot comment with empty content!"
    );
    return false;
  }
  let numComments = getRandomIntBetween(news.commentStart, news.commentEnd);
  logger("Cần comment " + numComments + " bài");
  let count = 0;
  for (let i = 0; i < numComments * 2; i++) {
    try {
      let temp = 0;
      await returnHomePage(page);
      await delay(2000);
      await scrollSmooth(page,getRandomIntBetween(1,5));
      await delay(2000);
      let commentBtns = await findBtns(page, "comment");
      if (!commentBtns || commentBtns.length == 0) {
        logger(
          "Debug" + "|" + "NewsFeed" + "|" + "Can not find any comment buttons"
        );
        return false;
      }
      for (let i = 0; i < commentBtns.length; i++) {
        const onScreen = await checkExistElementOnScreen(commentBtns[i]);
        if (onScreen == 0) {
          const rd = getRandomIntBetween(0, 100);
          if (rd < 50) {
            await delay(randomDelay);
            await commentBtns[i].click();
            await delay(2000);
            let content = news.commentText;
            let randomString = content[getRandomInt(content.length)];
            await delay(2000);
            await page.keyboard.type(randomString, { delay: 100 });
            await delay(2000);
            await page.keyboard.press("Enter");
            await delay(3000);
            count++;
            logger("Comment thành công " + count + " bài");
            break;
          } else {
            temp = 1;
            await delay(2000);
            break;
          }
        }
      }
      if(temp == 1){
        logger("Xem bài viết thành công");
        await delay(2000);
        i--;
      }
      if (count == numComments) {
        logger("Xong comment!");
        await delay(3000);
        loopComment++;
        break;
      }
    } catch (error) {
      logger(error);
    }
  }
}
  if(news.isLike == false && news.isShare == false && news.isComment == false) {
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
