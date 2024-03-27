export const getInfor = (profile) => {
  if (!profile.follower) {
    return `{
        try {
         
          const checkPageIsLive = checkIsLive(page);
          if (!checkPageIsLive) {
            logger("Page null!");
            return false;
          }
          await returnHomePage(page);
          await delay(2000);
          const disibleNoti = await getElement(
            page,
            '[class="_a9-- _ap36 _a9_1"]',
            10
          );
          if (disibleNoti) {
            await disibleNoti.click();
          }
          const elProfile = await getElement(page, "a span img");
          if (elProfile) {
            await elProfile.click();
            await delay(5000); 
            let follower;
            let following;
            const elLinks = await getElements(page, "a");
           
            if (elLinks && elLinks.length) {
              for (let i = 0; i < elLinks.length; i++) {
                const href = await elLinks[i].evaluate((element) => element.href);
                if (href && href.toString().includes("/followers")) {
                  follower = await getText(page, elLinks[i]);
                } else if (href && href.toString().includes("/following")) {
                  following = await getText(page, elLinks[i]);
                }
              }
            }
            if(follower && following){
              logger('${profile.id}','Update follower:' + follower + "|" + following);
            }
          }
        } catch (e) {
          logger(e);
        }
      }`;
  }
  return '';
};
