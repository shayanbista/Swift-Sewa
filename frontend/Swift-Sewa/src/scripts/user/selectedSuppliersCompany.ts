import { ServiceToCompany } from "./../../interface/company";
import { supplierApi } from "../../api/supplier";
import { Company } from "../../interface/company";

export class SelectedSupplierCompanyActions {
  static selectedSupplierCompany = async () => {
    console.log("hash", window.location.hash);

    const companyId = window.location.hash.split(":")[1];

    async function init() {
      try {
        const id = Number(companyId);
        const response = await supplierApi.getOne(id);
        renderContent(response);
      } catch (err) {
        console.log("err", err);
      }
    }

    function renderContent(response: { companies: Company }) {
      const extractData = response.companies.ServiceToCompany.map(
        (item: ServiceToCompany) => ({
          id: item.id,
          name: item.service.name,
          price: item.price,
          description: item.description,
        })
      );

      const servicesContainer = document.querySelector(
        ".grid"
      ) as HTMLDivElement;

      servicesContainer.innerHTML = "";

      extractData.forEach((service) => {
        const serviceCard = `
      <div class="flex justify-center  h-60 -mt-32">
      <div class=" p-2 w-2/3  rounded-lg shadow-md flex   ">
        <a
          href="#"
          class="flex flex-col pl-6 bg-white border border-gray-200 rounded-lg shadow md:flex-row w-full hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          
          <div
            class="flex flex-col gap-y-3 items-start justify-center px-2 leading-normal"
          >
            <h5
              class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              ${service.name}
            </h5>

            <p class="text-1xl mb-3 font-normal text-gray-400 dark:text-gray-400">
              ${service.description}
            </p>

            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              <span>Price:Rs:</span><span>${service.price}</span>
            </p>

            <button  class=" book hover:bg-orange-300 translate-x-2">
              Book Now
            </button>
          </div>
        </a>
      </div>
      </div>
    `;
        servicesContainer.innerHTML += serviceCard;
      });

      const bookButtons = document.querySelectorAll(".book");
      bookButtons.forEach((button, index) => {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          const selectedCompanyServiceId = extractData[index].id;
          console.log(selectedCompanyServiceId);
          window.location.href = `#/user/booking/company/:${companyId}/service/:${selectedCompanyServiceId}`;
        });
      });
    }

    await init();
  };
}
