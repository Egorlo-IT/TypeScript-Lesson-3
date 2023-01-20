import { SearchFormData } from "./searchFormData.js";
import { Place } from "./place.js";
import { getPlaces } from "./rest/getPlaces.js";
import {
  renderSearchResultsBlock,
  renderEmptyOrErrorSearchBlock,
} from "./search-results.js";
import { renderToast } from "./lib.js";

export let bookingPossible = true;

export const search = async (entity: SearchFormData, param: Place) => {
  bookingPossible = true;
  const data = await getPlaces(param);
  if (
    data?.length !== 0 &&
    !data?.error &&
    data?.name !== "Error" &&
    data?.name !== "BadRequest"
  ) {
    renderSearchResultsBlock(data);

    setTimeout(() => {
      renderToast(
        {
          text: "Информация устарела. Обновите данные поиска",
          type: "warning",
        },
        {
          name: "Понял",
          handler: () => {
            console.log("Уведомление закрыто");
          },
        }
      );
      bookingPossible = false;
    }, 300000);
  } else {
    if (data?.length === 0) {
      renderEmptyOrErrorSearchBlock(
        "По выбранным критериям поиска нет предложений"
      );
    } else {
      console.log("Error:", data);
      renderEmptyOrErrorSearchBlock(`Error: ${data?.message}`);
    }
  }
};
