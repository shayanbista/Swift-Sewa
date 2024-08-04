import { supplierApi } from "../../api/supplier";
import { showToast } from "../../constants/toastify";
import { Company, CompanyApiResponse } from "../../interface/company";

export class CompaniesActions {
  static companies: () => void = () => {
    let currentPage = 1;
    const limit = 3;

    const init = async (page = 1) => {
      try {
        currentPage = page;
        const data = {
          page: currentPage,
          limit,
        };
        const response = await supplierApi.getAll(data);

        // Access the nested properties
        const {
          totalPages,
          currentPage: currentPageFromResponse,
          data: companies,
        } = response.companies;

        await renderContent(companies);
        updatePagination(totalPages);
      } catch (err) {
        console.log("err", err);
        showToast("An error occurred while fetching companies", 2000, "red");
        await renderContent([]);
      }
    };

    init();

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
            <p onclick="nextPage()" class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
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

const renderContent = async (companies: Company[]) => {
  console.log("companies", companies);
  const contentDiv = document.getElementsByClassName("content")[0];
  const noCompanies = document.getElementById("no-companies");

  contentDiv.innerHTML = "";

  if (companies.length === 0) {
    if (noCompanies) {
      noCompanies.style.display = "block";
    }
    return;
  }

  if (noCompanies) {
    noCompanies.style.display = "none";
  }

  companies.forEach((item: Company) => {
    const card = document.createElement("div");
    card.className = "rounded-xl overflow-hidden shadow-lg";
    card.innerHTML = `
      <div class="relative">
        <a href=${`#/supplier/companies/selected/`}>
          <img
            class="w-full h-[30vh] object-cover"
            src="${item.photo}"
            alt=""
          />
          <div
            class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"
          ></div>
        </a>
        <a href="#!">
          <div
            class="absolute bottom-0 left-0 bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out"
          >
            ${item.location}
          </div>
        </a>
        <a href="!#">
          <div
            class="text-sm absolute top-0 right-0 ${
              item.isActive ? "bg-green-600" : "bg-red-600"
            } px-4 text-white rounded-full h-16 w-16 flex flex-col items-center justify-center mt-3 mr-3 hover:bg-white hover:text-${
      item.isActive ? "green-600" : "red-600"
    } transition duration-500 ease-in-out"
          >
            <span class="font-bold">${
              item.isActive ? "active" : "inactive"
            }</span>
          </div>
        </a>
      </div>
      <div class="px-6 py-4">
        <a
          href="#"
          class="font-semibold text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out mb-4"
        >${item.name}</a>
        <p class="text-gray-500 text-sm">${item.description}</p> </br>
        <p class="text-gray-500 text-sm">${item.location}</p>
        <h1> ${item.isActive ? "active" : "inactive"}</h1>
      </div>
    `;

    contentDiv.appendChild(card);

    card!.onclick = () => {
      localStorage.setItem("companyId", String(item.id));
    };
  });
};
