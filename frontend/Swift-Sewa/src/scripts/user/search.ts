import { serviceApi } from "../../api/services";
import { SearchResultItem } from "../../interface/search";

export class UserSearchActions {
  static search = async () => {
    let currentPage = 1;
    const limit = 3;

    const init = async (page = 1) => {
      console.log("page", page);

      let hash = window.location.hash;
      let hashWithoutHash = hash.substring(1);
      let parts = hashWithoutHash.split("?");
      let query = parts[1];

      const getSearchedQuery = await serviceApi.getSearchedQuery(
        query,
        page,
        limit
      );
      console.log("searchedQuery", getSearchedQuery);

      await renderCategories(getSearchedQuery);
      updatePagination(getSearchedQuery.totalPages);
    };

    init();

    async function renderCategories(data: { data: SearchResultItem[] }) {
      const contentDiv = document.getElementsByClassName("content")[0];
      contentDiv.innerHTML = "";

      data.data.forEach((item: SearchResultItem) => {
        const company = item.company;
        const card = document.createElement("div");
        card.className = "rounded-xl overflow-hidden shadow-lg";
        card.innerHTML = `
          <div class="relative">
            <a href="javascript:void(0)" class="company-image">
              <img class="w-full h-[30vh] object-cover" src="${company.photo}" alt="" />
              <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-45"></div>
            </a>
            <div class="absolute bottom-0 left-0 bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
              ${company.location}
            </div>
          </div>
          <div class="px-6 py-2">
            <p class="font-semibold text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out text-indigo-600 mb-4">${company.name}</p>
            <p class="text-indigo-600 text-sm">${item.description}</p><br>
            <p class="text-gray-500 text-sm">${company.address}, ${company.location}</p>
            <p class="text-gray-500 text-sm">${company.phoneNumber}</p>
          </div>
        `;

        contentDiv.appendChild(card);

        const render = card.querySelector(
          ".company-image"
        ) as HTMLAnchorElement;
        render.onclick = () => {
          window.location.href = `#/user/companies/selected/:${item.company.id}`;
        };
      });
    }

    function updatePagination(totalPages: number) {
      const paginationElement = document.getElementById(
        "pagination"
      ) as HTMLDivElement;
      if (paginationElement) {
        const pagination = paginationElement.querySelector(
          "ul"
        ) as HTMLUListElement;
        pagination.innerHTML = `
          <li>
            <p onclick="previousPage()" class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span class="sr-only">Previous</span>
              <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
              </svg>
            </p>
          </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
          pagination.innerHTML += `
            <li>
              <p onclick="gotoPage(${i})" class="flex items-center justify-center px-3 h-8 leading-tight ${
            i === currentPage
              ? "text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
          } dark:border-gray-700 ${
            i === currentPage
              ? "dark:bg-gray-700 dark:text-white"
              : "dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          }">${i}</p>
            </li>
          `;
        }

        pagination.innerHTML += `
          <li>
            <p  onclick="nextPage()" class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span class="sr-only">Next</span>
              <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
              </svg>
            </p>
          </li>
        `;
      }
    }

    function previousPage() {
      if (currentPage > 1) {
        currentPage--;
        init(currentPage);
      }
    }

    function nextPage() {
      const totalPages =
        document.querySelectorAll("#pagination ul li").length - 2;

      if (currentPage < totalPages) {
        currentPage++;
        init(currentPage);
      }
    }

    function gotoPage(page: number) {
      currentPage = page;
      init(currentPage);
    }

    window.previousPage = previousPage;
    window.nextPage = nextPage;
    window.gotoPage = gotoPage;
  };
}
