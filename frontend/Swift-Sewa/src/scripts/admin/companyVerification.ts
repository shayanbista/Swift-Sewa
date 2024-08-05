import { Company, ServiceToCompany } from "./../../interface/company";
import { adminApi } from "../../api/admin";
import { showToast } from "../../constants/toastify";

export class CompanyVerification {
  static companyVerification: () => void = async () => {
    try {
      const id = window.location.hash.split(":")[1];

      const saveButton = document.getElementById(
        "verify-button"
      ) as HTMLButtonElement;

      const rejectButton = document.getElementById(
        "reject-button"
      ) as HTMLButtonElement;

      saveButton.onclick = async () => {
        const response = await adminApi.verifyCompany(Number(id), true);
        if (response === 200) {
          showToast(" Successful", 3000, "green");
          window.location.href = "#/admin/companies/pending/";
        } else {
          showToast("Company verification failed", 3000, "red");
        }
      };

      rejectButton.onclick = async () => {
        const response = await adminApi.verifyCompany(Number(id), false);
        showToast("Company rejected ", 3000, "green");
        window.location.href = "#/admin/companies/pending/";
      };

      const data = await adminApi.getSelectedPendingCompnay(Number(id));

      await renderContent(data);

      function displayServices(services: ServiceToCompany[]) {
        const servicesList = document.querySelector(
          ".services-list"
        ) as HTMLUListElement;
        servicesList.innerHTML = "";

        services.forEach((serviceToCompany: ServiceToCompany) => {
          const listItem = document.createElement("li");
          listItem.classList.add(
            "service-item",
            "text-black",
            "text-lg",
            "p-6",
            "border-b",
            "border-gray-600"
          );
          listItem.setAttribute(
            "data-id",
            serviceToCompany.service.id.toString()
          );

          const serviceHeader = document.createElement("div");
          serviceHeader.classList.add(
            "service-header",
            "flex",
            "justify-between",
            "items-center"
          );

          const serviceName = document.createElement("h3");
          serviceName.classList.add("service-name", "font-bold");
          serviceName.textContent = serviceToCompany.service.name;

          const servicePrice = document.createElement("span");
          servicePrice.classList.add("service-price", "text-sm");
          servicePrice.textContent = serviceToCompany.service.price;

          serviceHeader.appendChild(serviceName);
          serviceHeader.appendChild(servicePrice);

          const serviceDescription = document.createElement("span");
          serviceDescription.classList.add("service-description", "text-sm");
          serviceDescription.textContent = serviceToCompany.service.description;

          const contentContainer = document.createElement("div");
          contentContainer.classList.add(
            "content-container",
            "flex",
            "flex-col",
            "gap-4"
          );

          contentContainer.appendChild(serviceHeader);
          contentContainer.appendChild(serviceDescription);

          listItem.appendChild(contentContainer);
          servicesList.appendChild(listItem);
        });
      }

      async function renderContent(data: Company) {
        const image = document.getElementById(
          "company-image"
        ) as HTMLImageElement;

        image.src = data.photo;

        const companyName = document.querySelector(".name") as HTMLSpanElement;
        companyName.textContent = data.name;

        const addressName = document.querySelector(
          ".address"
        ) as HTMLSpanElement;
        addressName.textContent = data.address;

        const phone = document.querySelector(".phone") as HTMLSpanElement;
        phone.textContent = data.phoneNumber;

        const openingTime = document.querySelector(
          ".openingTime"
        ) as HTMLSpanElement;
        openingTime.textContent = data.openingTime;

        const closingTime = document.querySelector(
          ".closingTime"
        ) as HTMLSpanElement;
        closingTime.textContent = data.closingTime;

        const isActive = document.querySelector(".status") as HTMLSpanElement;
        isActive.textContent = data.isPending ? "Pending" : "Active";

        const location = document.querySelector(".location") as HTMLSpanElement;
        location.textContent = data.location;

        const panPhoto = document.getElementById(
          "pan-photo"
        ) as HTMLImageElement;

        const panPhotoLoader = document.getElementById(
          "photo-loader"
        ) as HTMLButtonElement;

        panPhoto.src = data.panPhoto;

        const categoryName = document.getElementById(
          "category-name"
        ) as HTMLSpanElement;
        categoryName.textContent = data.category.name;

        const categoryDescription = document.getElementById(
          "category-description"
        ) as HTMLSpanElement;

        categoryDescription.textContent = data.category.description;
        panPhotoLoader.onclick = () => {
          panPhoto.classList.toggle("hidden");
        };

        displayServices(data.ServiceToCompany);
      }
    } catch (err) {
      console.log("err", err);
    }
  };
}
