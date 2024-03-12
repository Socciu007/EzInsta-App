export const deletePost = (setting) => {
  const strSetting = `{
      delayTimeStart: ${setting.delayTimeStart},
      delayTimeEnd: ${setting.delayTimeEnd},
      viewTimeStart: ${setting.viewTimeStart},
      viewTimeEnd: ${setting.viewTimeEnd},
      text: ${JSON.stringify(setting.text)},
    }`;
  return `          
  const DeletePost = ${strSetting}
      try {
        //Check obj start < end ? random(start,end) : random(end,start)
        let post = await checkObject(DeletePost);
        // check page is live return -1, return 1, return 0
        const isLive = checkIsLive(page);
        logger('Tình trạng trang web:'+ isLive);
        if (!isLive) return -1;
        await returnHomePage(page);
        await delay(3000);
        let randomViewTime = getRandomIntBetween(post.viewTimeStart * 1000, post.viewTimeEnd * 1000);
        let randomDelay = getRandomIntBetween(post.delayTimeStart * 1000, post.delayTimeEnd * 1000);
        let UIDList = post.text.length
        logger('Cần xóa '+ UIDList + ' bài');
        let count = 0;
        for(let i = 0 ; i < UIDList; i++){
          await page.goto('https://www.instagram.com/p/' + post.text[i], {
             waitUntil: 'networkidle2',
             timeout: 60000,
          });
          await delay(3000);
          const btns = await getElements(page, '[role = "button"] svg');
          if(!btns || btns.length == 0) {
             logger('URL không chính xác');
             continue;
          }
          await delay(randomViewTime);

          await btns[0].click();
          await delay(3000);
          const buttons = await getElements(page, 'div[role="dialog"] button');
          if(buttons.length == 0 || !buttons) {
            break;
          }
          if(buttons.length <= 6){
            logger("Không xóa được post của người khác");
            continue;
          }
          await delay(randomDelay);
          await buttons[0].click();
          await delay(3000);
          const deleteBtns = await getElements(page, 'div[role="dialog"] button');
          if(deleteBtns.length == 0 || !deleteBtns) {
            break;
          }
          await delay(2000);
          await deleteBtns[0].click();
          
          count++;
          logger("Xóa thành công "  + count + " bài");
          await delay(randomDelay);
        }
      } catch (error) {
        logger(error);
      }
    `;
};
