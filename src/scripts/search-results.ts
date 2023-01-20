import { renderBlock } from "./lib.js";
import { SearchFormData } from "./searchFormData.js";
import { toggleFavoriteItem } from "./toggleFavoriteItem.js";
import { Booking } from "./booking.js";
import { getBooking } from "./rest/getBooking.js";
import { renderToast } from "./lib.js";
import { bookingPossible } from "./search.js";

const runBooking = async (el) => {
  console.log(bookingPossible);

  const elResultBlock: HTMLFormElement =
    el.parentNode.parentNode.parentNode.parentNode.parentNode;

  const checkInDate: string = (<HTMLInputElement>(
    document.getElementById("check-in-date")
  )).value;

  const checkOutDate: string = (<HTMLInputElement>(
    document.getElementById("check-out-date")
  )).value;

  const bookData: Booking = {
    id: +elResultBlock.dataset.id,
    checkInDate: new Date(checkInDate).getTime(),
    checkOutDate: new Date(checkOutDate).getTime(),
  };

  const response = await getBooking(bookData);

  if (
    !response?.error &&
    response?.name !== "Error" &&
    response?.name !== "BadRequest"
  ) {
    renderToast(
      {
        text: "Бронирование успешно завершено",
        type: "success",
      },
      {
        name: "Понял",
        handler: () => {
          console.log("Уведомление закрыто");
        },
      }
    );
  } else {
    console.log("Error:", response);
    renderToast(
      {
        text: "На выбранные даты бронирование этого отеля недоступно.",
        type: "error",
      },
      {
        name: "Понял",
        handler: () => {
          console.log("Уведомление закрыто");
        },
      }
    );
  }
};

const appendItems = (elementClass: string, data: any) => {
  let html = "";
  let found: string;
  const favoriteItems = JSON.parse(localStorage.getItem("favoriteItems"));

  data.forEach((item) => {
    if (favoriteItems) {
      found = favoriteItems.find(
        (record: { name: string }) => record.name === item.name
      );
    }

    html += `
    <li class="result" data-id=${item.id}>
      <div class="result-container">
        <div class="result-img-container">
          <div class="favorites ${found ? "active" : ""}"></div>
          <img class="result-img" src=${item.image} alt="">
        </div>	
        <div class="result-info">
          <div class="result-info--header">
            <p>${item.name}</p>
            <p class="price">${item.price}&#8381;</p>
          </div>
          <div class="result-info--map"><i class="map-icon"></i> ${
            item.remoteness
          } км от вас</div>
          <div class="result-info--descr">${item.description}</div>
          <div class="result-info--footer">
            <div>
              <button class="btn-booking">Забронировать</button>
            </div>
          </div>
        </div>
      </div>
    </li>
  `;
  });

  const element = document.querySelector(elementClass);
  element.innerHTML = html;
  toggleFavoriteItem();

  element.querySelectorAll(".btn-booking").forEach((button) => {
    button.addEventListener("click", (event: Event) => {
      const { target } = event;
      bookingPossible && runBooking(target as HTMLFormElement);
    });
  });
};

export const renderSearchStubBlock = () => {
  renderBlock(
    "search-results-block",
    `
      <div class="before-results-block">
        <img src="img/start-search.png" />
        <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
      </div>
    `
  );
};

export const renderEmptyOrErrorSearchBlock = (reasonMessage: any) => {
  renderBlock(
    "search-results-block",
    `
      <div class="no-results-block">
        <img src="img/no-results.png" />
        <p>${reasonMessage}</p>
      </div>
    `
  );
};

export const renderSearchResultsBlock = (data: SearchFormData) => {
  renderBlock(
    "search-results-block",
    `
      <div class="search-results-header">
          <p>Результаты поиска</p>
          <div class="search-results-filter">
              <span><i class="icon icon-filter"></i> Сортировать:</span>
              <select>
                  <option selected="">Сначала дешёвые</option>
                  <option selected="">Сначала дорогие</option>
                  <option>Сначала ближе</option>
              </select>
          </div>
      </div>
      <ul class="results-list"></ul>
    `
  );
  appendItems(".results-list", data);
};
