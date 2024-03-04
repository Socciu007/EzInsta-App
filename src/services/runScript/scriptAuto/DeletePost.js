export const deletePost = (setting) => {
  const strSetting = `{
      delayTimeStart: ${setting.delayTimeStart},
      delayTimeEnd: ${setting.delayTimeEnd},
      lineCount: ${setting.lineCount},
      viewTimeStart: ${setting.viewTimeStart},
      viewTimeEnd: ${setting.viewTimeEnd},
      text: ${JSON.stringify(setting.text)},
    }`;
  return `
  const clickDelete = async (page) => {
    const optionSelector = '#screen-root > div > div > div > div > div> div > div > button';
    // Check co button option
    if ((await checkExistElementOnScreen(page, optionSelector)) === 0) {
      const optionBtn = await getElement(page, optionSelector, 5);
      await delay(2000);
      await clickElement(optionBtn);
      await delay(2000);
  
      const deleteBtn = await findBtn(page, '󰘝');
      // Check co button delete
      if (deleteBtn) {
        await delay(2000);
        await clickElement(deleteBtn);
        await delay(2000);
  
        // Check có nút confirm delete
        if (
          (await checkExistElementOnScreen(
            page,
            '#screen-root > div.m.dialog-screen > div.m > div > div > div:nth-child(2) > div:nth-child(1) > div > button',
          )) === 0
        ) {
          const confirmDeleteBtn = await getElement(
            page,
            '#screen-root > div.m.dialog-screen > div.m> div > div > div:nth-child(2) > div:nth-child(1) > div > button',
          );
          await clickElement(confirmDeleteBtn);
          await delay(5000);
          return true;
        } else {
          logger("Debug" + "|" + "Delete post" + "|" + "Can't find confirm delete button!");
          return false;
        }
      } else {
        logger("Debug" + "|" + "Delete post" + "|" + "Can't find delete button!");

        return false;
      }
    }
    return false;
  };

    
    const findBtn = async (page, content) => {
  try {
    const buttons = await getElements(page, '[class="native-text"]');
    for (let i = 0; i < buttons.length; i++) {
      const btn = await page.evaluate((el) => {
        return el.innerHTML;
      }, buttons[i]);

      if (btn.includes(content)) {
        return buttons[i];
      }
    }
  } catch (err) {
    logger(err);
  }
};

const returnPost = async (page, id, fbid) => {
    const url = await page.url();
    if (
      url === 'https://m.facebook.com/story.php/?id=' + id + '&story_fbid=' + fbid ||
      url.includes('https://m.facebook.com/story.php/?id=' + id + '&story_fbid=' + fbid)
    ) {
      logger('URL is correct');
    } else {
      logger('Redirect to post');
      await page.goto('https://m.facebook.com/story.php/?id=' + id + '&story_fbid=' + fbid, {
        waitUntil: 'networkidle2',
      });
    }
  };
      
      const DeletePost = ${strSetting}
      try {
        //Check obj start < end ? random(start,end) : random(end,start)
        let post = await checkObject(DeletePost);
        // check page is live reutrn -1, return 1, return 0
        const isLive = checkIsLive(page);
        logger('Tình trạng trang web:'+ isLive);
        if (!isLive) return -1;
        await returnHomePage(page);
        await delay(2000);
      
        let randomViewTime = getRandomIntBetween(post.viewTimeStart * 1000, post.viewTimeEnd * 1000);
      
        let countDelete = 0;
        logger('Cần delete'+ post.lineCount+ 'bài');
        while (randomViewTime > 0 && countDelete < post.lineCount) {
          await returnHomePage(page);
          const startTime = Date.now();
          const userID = await page.evaluate(() => {
            if (window.Env && window.Env.userid) {
              return window.Env.userid;
            } else {
              return null;
            }
          });
      
          if (userID) {
            logger('UserID:'+  userID);
          } else {
            logger("Debug" + "|" + "Delete post" + "|" + "UserID not found.");

            return 0;
          }
      
          for (let i = 0; i < post.lineCount; i++) {
            try {
              await returnPost(page, userID, post.text[i]);
              await delay(3000);
              const result = await clickDelete(page);
              if (result) {
                logger('Đã delete được'+ countDelete + 1+ 'bài');
              } else {
                logger('Khong delete post');
              }
              countDelete++;
            } catch (err) {
              logger(err);
            }
            await delay(2000);
          }
          let randomDelay = getRandomIntBetween(post.delayTimeStart * 1000, post.delayTimeEnd * 1000);
          await delay(randomDelay);
          const endTime = Date.now();
          randomViewTime -= endTime - startTime;
          logger('randomViewTime ' + randomViewTime);
        }
      
        let randomDelay = getRandomIntBetween(post.delayTimeStart * 1000, post.delayTimeEnd * 1000);
        await delay(randomDelay);
        logger('Da delete xong');
      } catch (error) {
        logger(error);
      }
    `;
};
