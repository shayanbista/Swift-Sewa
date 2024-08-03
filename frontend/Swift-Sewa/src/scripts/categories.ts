import { Company } from "./../interface/company";
import { categoryApi } from "../api/categories";
import { showToast } from "../constants/toastify";

export class CategoriesActions {
  static categories: () => void = () => {
    let currentPage = 1;
    const limit = 3;

    const id = window.location.hash.split(":")[1];

    let location = localStorage.getItem("location");
    location == null ? (location = "Kathmandu") : location;

    const init = async (page = 1) => {
      currentPage = page;
      try {
        const body = {
          id: id,
          location: location as string,
          page: page,
          limit: limit,
        };

        const response = await categoryApi.getCompanyByCategory(body);
        await renderCategories(response);
        updatePagination(response.message.totalPages);
      } catch (err) {
        showToast("Something went wrong,Please try again later", 3000, "red");
      }
    };

    init();

    async function renderCategories(data: { message: { data: Company[] } }) {
      console.log("data", data.message.data.length);
      const contentDiv = document.getElementsByClassName("content")[0];
      contentDiv.innerHTML = "";

      const result = data.message.data.forEach((item: Company) => {
        const card = document.createElement("div");
        card.className = "rounded-xl overflow-hidden shadow-lg";
        card.innerHTML = `
          <div class="relative">
            <a href="javascript:void(0)" class="company-image">
              <img class="w-full h-[30vh] object-cover" src="${item.photo}" alt="" />
              <div class="hover:bg-gray-700 transition duration-300 absolute bottom-0 top-0 right-0 left-0 opacity-30"></div>
            </a>
            <div class="absolute bottom-0 left-0 bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
              ${item.location}
            </div>
          </div>
          <div class="px-6 py-2 bg-orange-50">
            <p class="font-semibold text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out text-indigo-600 mb-4">${item.name}</p>
            <p class="text-indigo-600 text-sm">${item.description}</p><br>
            <p class="text-gray-500 text-sm">${item.address}, ${item.location}</p>
            <p class="text-gray-500 text-sm">${item.phoneNumber}</p>
          </div>
        `;

        contentDiv.appendChild(card);

        const render = card.querySelector(
          ".company-image"
        ) as HTMLAnchorElement;
        render.onclick = () => {
          window.location.href = `#/user/companies/selected/:${item.id}`;
        };
      });

      data.message.data.length == 0
        ? (contentDiv.innerHTML = "No companies found")
        : result;
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
