export const createPost = (setting) => {
  const strSetting = `
  {
    caption: ${JSON.stringify(setting.caption)},
    photos: ${JSON.stringify(setting.photos)},
  }`;
  console.log(strSetting);
  return `
 
const clickClose = async (page) => {
  try {
    const closeBtn = await getElement(page, "polyline");
    if(!closeBtn) {
      await page.goBack();
    }
    await delay(2000);
    await closeBtn.click();
    await delay(2000);
    logger("click close");
  } catch(error) {
    logger(error);
  }
}
  const object = ${strSetting}
  try {
    //Check obj start < end ? random(start,end) : random(end,start)
    let obj = await checkObject(object);
    // check page is live return -1, return 1, return 0
    const checkPageIsLive = checkIsLive(page);
    if (!checkPageIsLive) return -1;
    await returnHomePage(page);
    await delay(2000);
    await turnOffNoti(page);
    await delay(2000);
    const iconCreate = await getElement(page, '[d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z"]');
    if(!iconCreate){
      logger(
            "Debug" + "|" + "Create Post" + "|" + "Cannot find post button"
          );
      return false;
    } 
    await delay(2000);
    await iconCreate.click();
    await delay(5000);
    const check = await getElement(page, '[role="dialog"]');
    if(!check) {
       const elements = await getElements(page, '[href="#"]');
       if(!elements) return false;
       await delay(2000);
       await elements[1].click();
       await delay(3000);
    }
    let arr = [];
    for(let i = 0; i < obj.photos.length; i++){
      const option = await getElement(page, '[role="dialog"] button');
      if(!option) {
             logger(
            "Debug" + "|" + "Create Post" + "|" + "Cannot find upload button"
          );
        break;
      }
      let randomImg = getRandomIntBetween(0, obj.photos.length);
      if(arr.indexOf(randomImg) == -1){
        arr.push(randomImg);
      } else {
        continue;
      }
      const [fileChooser] = await Promise.all([page.waitForFileChooser(), await clickElement(option)]);
      await fileChooser.accept([obj.photos[randomImg]]);
      await delay(8000);
      const iconWarning = await getElement(page, '[d="M48 0c26.5 0 48 21.5 48 48S74.5 96 48 96 0 74.5 0 48 21.5 0 48 0zm0 2C22.6 2 2 22.6 2 48s20.6 46 46 46 46-20.6 46-46S73.4 2 48 2zm0 57.8c3.4 0 6.1 2.7 6.1 6.1 0 3.4-2.7 6.1-6.1 6.1s-6.1-2.7-6.1-6.1c0-3.3 2.7-6.1 6.1-6.1zm0 2c-2.3 0-4.1 1.8-4.1 4.1S45.7 70 48 70s4.1-1.8 4.1-4.1c0-2.2-1.8-4.1-4.1-4.1zM48 23c3.5 0 6.4 2.8 6.1 6.2l-1.6 22.5c-.2 2.3-2.2 4-4.5 4-2.4 0-4.4-1.7-4.5-4l-1.6-22.5c-.3-3.4 2.6-6.2 6.1-6.2zm0 2c-2.4 0-4.3 1.9-4.1 4l1.6 22.5c.1 1.2 1.2 2.1 2.5 2.1s2.4-.9 2.5-2.1L52.1 29c.2-2.1-1.7-4-4.1-4z"]');
      if(iconWarning){
        continue;
      } 
      const btns = await getElements(page, '[role="dialog"] [role="button"]');
      if(!btns || btns.length == 0){
          logger(
            "Debug" + "|" + "Create Post" + "|" + "Cannot find any buttons"
          );
        break;
      }
      await btns[1].click();
      await delay(5000);
      const nextBtns = await getElements(page, '[role="dialog"] [role="button"]');
      if(!nextBtns || nextBtns.length == 0){
           logger(
            "Debug" + "|" + "Create Post" + "|" + "Cannot find next buttons"
          );
        break;
      }
      await nextBtns[1].click();
      await delay(5000);
      const area = await getElement(page, '[role="dialog"] [role="textbox"]');
      if(!area){
           logger(
            "Debug" + "|" + "Create Post" + "|" + "Cannot find text area"
          );
        break;
      }
      await area.click();
      await delay(5000);
      if(!obj.caption){
           logger(
            "Debug" + "|" + "Create Post" + "|" + "Caption is empty"
          );
          break
      } ;
      let content = obj.caption;
      let randomString = content[getRandomInt(content.length)];
      await delay(2000);
      await page.keyboard.type(randomString, { delay: 100 });
      await delay(2000);
      const shareBtns = await getElements(page, '[role="dialog"] [role="button"]');
      if(!shareBtns || shareBtns.length == 0){
        logger(
            "Debug" + "|" + "Create Post" + "|" + "Cannot find share button"
          );
        break;
      }
      await shareBtns[1].click();
      await delay(5000);
      break;
    }      
    await clickClose(page);
    await delay(2000);
    logger("Đăng bài thành công");
  } catch (error) {
    logger(error);
  }
`;
};
