export const getInfor = (profile) => {
  if (!profile.nameAccount || !profile.friends) {
    return `{
            try{
                const checkPageIsLive = checkIsLive(page);
    if (!checkPageIsLive) {
      logger("Page null!");
      return false;
    }

    await page.goto('https://mbasic.facebook.com/me', {
          waitUntil: 'networkidle2',
          timeout: 60000,
        });

         const elName = await getElement(page,'span strong');
         if(elName){
            const name = await getText(page, elName);
            let isClick = false;
            const elFriends = await getElements(page,'a');
            logger(elFriends.length);
            for(let i=0;i<elFriends.length;i++){
                const href = await elFriends[i].evaluate(element => element.href);
                if(href && href.includes('friends&lst')){
                    await elFriends[i].click();
                    isClick = true;
                    break;
                }
            }
            if(!isClick){
                await page.goto('https://mbasic.facebook.com/me/friends', {
                    waitUntil: 'networkidle2',
                    timeout: 60000,
                  });
            }
            const more = await getElement(page,'[id="m_more_friends"]', 15);
            if(more){
                let textFriends = '';
                const elTexts =  await getElements(page,'h3', 2);
                for(let i=0;i< elTexts.length;i++){
                    const text = await getText(page, elTexts[i]);
                    if(text.includes('(')){
                        textFriends = text.split("(")[1] ? text.split("(")[1].replace(")","") : '';
                        break;
                    }
                }
                logger('${profile.id}','Update name:' + name + "|" + textFriends);
            }
            else{
                logger('${profile.id}','Update name:' + name);
            }
           
         }
         
            }catch(e){
                logger(e)
            }
        }`;
  }
  return '';
};
