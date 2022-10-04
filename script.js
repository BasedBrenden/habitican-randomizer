'use strict';

import { randomAnimals } from "./Modules/randomAnimals";
import { randomTransformationItem } from "./Modules/randomTransformationItem";
import { buyRandomEquipment } from "./Modules/buyRandomEquipment";
import { randomBackground } from "./Modules/randomBackground";
import { equipRandomEquipment } from "./Modules/equipRandomEquipment";
import { startRandomQuest } from "./Modules/startRandomQuest";
import { fetchAPI } from "./Modules/utils";

const headers = {
  'x-client':
    "c073342f-4a65-4a13-9ffd-9e7fa5410d6b - Ieahleen's Habitican Randomizer",
};
const get = { method: 'GET' };
const post = { method: 'POST' };

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  build();
});

async function build() {
  let UUID = document.getElementById('UUID').value;
  let apiKey = document.getElementById('api-key').value;
  document.getElementById('main').innerHTML =
    '<form class="wrapper"><p>Loading..</p></div>';

  [headers['x-api-user'], headers['x-api-key']] = [UUID, apiKey];

  const {
    data: {
      items: {
        mounts: mountsObj,
        pets: petsObj,
        special: specialObj,
        quests: questsObj,
        gear: { owned: gearObj },
      },
      stats: { gp: goldOwned, class: userClass, lvl: userLevel },
      purchased: { background: backgroundsObj },
    },
  } = await fetchAPI('https://habitica.com/api/v3/user', get);

  const {
    success: partyDataWasFound,
    error,
    data: partyMembersArr,
  } = await fetchAPI(
    'https://habitica.com/api/v3/groups/party/members?includeAllPublicFields=true',
    get
  );

  const { data: availableEquipmentArr } = await fetchAPI(
    'https://habitica.com/api/v3/user/inventory/buy',
    get
  );

  const {
    data: {
      gear: { flat: allGear },
    },
  } = await fetchAPI(
    'https://habitica.com/api/v3/content' + '?language=en',
    get
  );

  document.getElementById('main').innerHTML = '';

  randomAnimals(mountsObj, petsObj);

  if (partyDataWasFound) {
    randomTransformationItem(specialObj, partyMembersArr);
    const {
      data: { quest },
    } = await fetchAPI('https://habitica.com/api/v3/groups/party', get);
    if (!quest.key) {
      startRandomQuest(questsObj, userLevel);
    }
  }

  randomBackground(Object.keys(backgroundsObj));

  buyRandomEquipment(goldOwned, availableEquipmentArr);

  equipRandomEquipment(gearObj, allGear);
}
