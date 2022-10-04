export const randomElementFromArray = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
export const fetchAPI = async (url, params) => {
    const response = await fetch(url, { headers, ...params });
    return response.json();
  }
  
export const equipItem = async (type, key) => {
    return await fetchAPI(
      `https://habitica.com/api/v3/user/equip/${type}/${key}`,
      post
    );
  }
  
export const castSkill = async (spellId, targetId) => {
    let url = `https://habitica.com/api/v3/user/class/cast/${spellId}`;
    if (targetId) {
      url += '?targetId=' + targetId;
    }
    let response = await fetchAPI(url, post);
    return response;
  }