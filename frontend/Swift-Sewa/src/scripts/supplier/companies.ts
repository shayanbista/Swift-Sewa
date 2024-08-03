import { supplierApi } from "../../api/supplier";
import { showToast } from "../../constants/toastify";
import { Company, CompanyApiResponse } from "../../interface/company";

export class CompaniesActions {
  static companies: () => void = () => {
    const init = async () => {
      try {
        const response = await supplierApi.getAll();
        console.log("response", response);
        showToast("hello", 2000, "green");
        await renderContent(response);
      } catch (err) {
        console.log("err", err);
      }
    };

    init();
  };
}

const renderContent = async (data: CompanyApiResponse) => {
  const contentDiv = document.getElementsByClassName("content")[0];

  contentDiv.innerHTML = "";

  data.companies.forEach((item: Company) => {
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
        <span class="font-bold">${item.isActive ? "active" : "inactive"}</span>
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
        </div>
      `;

    contentDiv.appendChild(card);

    card!.onclick = () => {
      localStorage.setItem("companyId", String(item.id));
    };
  });
};
