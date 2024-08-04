import { ServiceToCompany } from "./../../interface/company";
import { Service } from "./../../interface/service";

import { categoryApi } from "../../api/categories";
import { supplierApi } from "../../api/supplier";
import { required } from "joi";

export class SelectedCompanyActions {
  static selected: () => void = async () => {
    const updateButton = document.getElementById(
      "update-button"
    ) as HTMLButtonElement;
    const saveButton = document.getElementById(
      "save-button"
    ) as HTMLButtonElement;
    const deleteButton = document.getElementById(
      "delete-button"
    ) as HTMLButtonElement;
    const addServiceButton = document.getElementById(
      "add-service-button"
    ) as HTMLButtonElement;

    const categoryName = document.getElementsByClassName("");

    const servicesOfCategory: Service[] = [];

    const fetchServices = async () => {
      try {
        const categoryId = localStorage.getItem("categoryId");
        const category = await categoryApi.getOne(Number(categoryId));
        servicesOfCategory.push(...category.services);
      } catch (err) {
        console.log("err", err);
      }
    };

    deleteButton?.addEventListener("click", () => {
      updateButton.disabled = true;
      saveButton.classList.add("hidden");
      updateButton.classList.add("block");
      deleteServices();
    });

    addServiceButton.addEventListener("click", () => {
      deleteButton.disabled = true;
      addNewService();
    });

    updateButton?.addEventListener("click", () => {
      addServiceButton.disabled = true;
      toggleEditMode(true);
    });

    saveButton?.addEventListener("click", () => {
      saveChanges();
      toggleEditMode(false);
    });

    function deleteServices() {
      const servicesList = document.querySelector(
        ".services-list"
      ) as HTMLUListElement;
      if (servicesList) {
        const services = servicesList.querySelectorAll("li");
        services.forEach((service) => {
          const binIcon = document.createElement("span");
          binIcon.classList.add("bin-icon", "cursor-pointer");
          binIcon.innerHTML = "&#128465;";

          binIcon.addEventListener("click", async () => {
            const serviceId = service.getAttribute("data-id");
            const companyId = localStorage.getItem("companyId");

            try {
              const deletedService = await supplierApi.deleteCompanyService({
                companyId,
                serviceId,
              });
              updateButton.disabled = false;
              saveButton.classList.add("hidden");
              updateButton.classList.add("block");
              window.location.reload();
            } catch (err) {
              console.log("err", err);
            }
          });

          service.appendChild(binIcon);
        });
      } else {
        console.error("Services list not found");
      }
    }

    function displayServices(services: ServiceToCompany[]) {
      console.log("services", services);

      const servicesList = document.querySelector(
        ".services-list"
      ) as HTMLUListElement;
      servicesList.innerHTML = "";

      services.forEach((serviceToCompany: ServiceToCompany, index: number) => {
        const listItem = document.createElement("li");
        listItem.classList.add(
          "service-item",
          "text-black",
          "text-lg",
          "p-6",
          "border-b",
          "border-gray-600"
        );
        listItem.setAttribute("data-id", serviceToCompany.service.id);

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

        servicePrice.textContent = `${serviceToCompany.price}/hr`;

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

    function canAddMoreServices(): boolean {
      const currentServiceCount =
        document.querySelectorAll(".service-item").length;
      return servicesOfCategory.length > currentServiceCount;
    }

    function addNewService() {
      if (!canAddMoreServices()) {
        alert("You've reached the maximum number of services allowed.");
        return;
      }
      const servicesList = document.querySelector(
        ".services-list"
      ) as HTMLUListElement;
      const existingServices = Array.from(
        servicesList.querySelectorAll(".service-name")
      ).map((nameElement) => (nameElement as HTMLElement).textContent);

      let newServiceData = servicesOfCategory.find(
        (service) => !existingServices.includes(service.name)
      );

      if (!newServiceData) {
        alert("All available services have been added.");
        return;
      }

      const listItem = document.createElement("li");
      listItem.classList.add(
        "service-item",
        "text-black",
        "text-lg",
        "p-6",
        "border-b",
        "border-gray-600"
      );
      listItem.setAttribute("data-id", newServiceData.id);

      const serviceHeader = document.createElement("div");
      serviceHeader.classList.add(
        "service-header",
        "flex",
        "justify-between",
        "items-center"
      );

      const serviceName = document.createElement("span");
      serviceName.classList.add("service-name", "font-bold");
      serviceName.textContent = newServiceData.name;

      const servicePrice = document.createElement("input") as HTMLInputElement;
      servicePrice.classList.add(
        "service-price",
        "text-sm",
        "text-black",
        "w-1/2",
        "p-2",
        "rounded-full",
        "border",
        "border-gray-400"
      );
      servicePrice.placeholder = "Service Price";
      servicePrice.type = "number";
      servicePrice.min = "0";
      servicePrice.step = "100";

      const serviceDescription = document.createElement("p");
      serviceDescription.classList.add("service-description", "text-sm");
      serviceDescription.textContent = newServiceData.description || "";

      serviceHeader.appendChild(serviceName);
      serviceHeader.appendChild(servicePrice);

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
    }

    function toggleEditMode(editMode: boolean) {
      const fields: string[] = [
        "name",
        "address",
        "phone",
        "openingTime",
        "closingTime",
        "status",
        "location",
      ];

      fields.forEach((field) => {
        const spanElement = document.querySelector(
          `.${field}`
        ) as HTMLSpanElement;

        if (editMode) {
          let inputElement: HTMLInputElement | HTMLSelectElement;

          if (field === "openingTime" || field === "closingTime") {
            inputElement = document.createElement("input") as HTMLInputElement;
            inputElement.type = "time";
            inputElement.value =
              spanElement.textContent || spanElement.dataset.oldValue || "";
          } else if (field === "location") {
            inputElement = document.createElement(
              "select"
            ) as HTMLSelectElement;
            const kathmanduOption = document.createElement(
              "option"
            ) as HTMLOptionElement;
            kathmanduOption.value = "Kathmandu";
            kathmanduOption.text = "Kathmandu";

            const bhaktapurOption = document.createElement(
              "option"
            ) as HTMLOptionElement;
            bhaktapurOption.value = "Bhaktapur";
            bhaktapurOption.text = "Bhaktapur";

            const lalitpurOption = document.createElement(
              "option"
            ) as HTMLOptionElement;
            lalitpurOption.value = "Lalipur";
            lalitpurOption.text = "Lalitpur";

            inputElement.add(kathmanduOption);
            inputElement.add(bhaktapurOption);
            inputElement.add(lalitpurOption);

            const defaultValue =
              spanElement.textContent ||
              spanElement.dataset.oldValue ||
              "kathmandu";
            inputElement.value = defaultValue;

            inputElement.addEventListener("change", (event) => {
              const selectedValue = (event.target as HTMLSelectElement).value;
            });
          } else if (field === "status") {
            inputElement = document.createElement(
              "select"
            ) as HTMLSelectElement;
            const activeOption = document.createElement(
              "option"
            ) as HTMLOptionElement;
            activeOption.value = "active";
            activeOption.text = "Active";

            const inactiveOption = document.createElement(
              "option"
            ) as HTMLOptionElement;
            inactiveOption.value = "inactive";
            inactiveOption.text = "Inactive";

            inputElement.add(activeOption);
            inputElement.add(inactiveOption);
            inputElement.value =
              spanElement.textContent ||
              spanElement.dataset.oldValue ||
              "active";
          } else {
            inputElement = document.createElement("input") as HTMLInputElement;
            inputElement.type = "text";
            inputElement.value =
              spanElement.textContent || spanElement.dataset.oldValue || "";
          }

          inputElement.classList.add(
            `input-${field}`,
            "text-black",
            "w-1/2",
            "p-2",
            "rounded-full",
            "border",
            "border-gray-400"
          );
          spanElement.replaceWith(inputElement);
        } else {
          const inputElement = document.querySelector(`.input-${field}`) as
            | HTMLInputElement
            | HTMLSelectElement;
          const newSpanElement = document.createElement("span");
          newSpanElement.classList.add(field);

          if (
            inputElement instanceof HTMLInputElement ||
            inputElement instanceof HTMLSelectElement
          ) {
            newSpanElement.textContent = inputElement.value;
            newSpanElement.dataset.oldValue = inputElement.value;
            inputElement.replaceWith(newSpanElement);
          }
        }
      });

      // Update service price and description
      const serviceItems = document.querySelectorAll(".service-item");
      serviceItems.forEach((serviceItem) => {
        const priceElement = serviceItem.querySelector(
          ".service-price"
        ) as HTMLElement;
        const descriptionElement = serviceItem.querySelector(
          ".service-description"
        ) as HTMLElement;

        if (editMode) {
          const priceInput = document.createElement(
            "input"
          ) as HTMLInputElement;
          priceInput.type = "string";
          console.log("priceElement", priceElement.textContent);

          priceInput.value = priceElement.textContent || "";
          console.log("priceValue", priceInput.value);

          priceInput.classList.add(
            "input-service-price",
            "text-black",
            "w-1/2",
            "p-2",
            "rounded-full",
            "border",
            "border-gray-400",
            "required"
          );

          const descriptionInput = document.createElement(
            "input"
          ) as HTMLInputElement;
          descriptionInput.type = "text";
          descriptionInput.value = descriptionElement.textContent || "";
          descriptionInput.classList.add(
            "input-service-description",
            "text-black",
            "w-1/2",
            "p-2",
            "rounded-full",
            "border",
            "border-gray-400"
          );

          priceElement.replaceWith(priceInput);
          descriptionElement.replaceWith(descriptionInput);
        } else {
          const priceInput = serviceItem.querySelector(
            ".input-service-price"
          ) as HTMLInputElement;
          const descriptionInput = serviceItem.querySelector(
            ".input-service-description"
          ) as HTMLInputElement;

          const newPriceElement = document.createElement("span");
          newPriceElement.classList.add("service-price", "text-sm");
          newPriceElement.textContent = priceInput.value;

          const newDescriptionElement = document.createElement("span");
          newDescriptionElement.classList.add("service-description", "text-sm");
          newDescriptionElement.textContent = descriptionInput.value;

          priceInput.replaceWith(newPriceElement);
          descriptionInput.replaceWith(newDescriptionElement);
        }
      });

      updateButton.classList.toggle("hidden", editMode);
      saveButton.classList.toggle("hidden", !editMode);
      addServiceButton.classList.toggle("hidden", !editMode);
    }

    async function saveChanges() {
      const fields: string[] = [
        "name",
        "address",
        "phone",
        "openingTime",
        "closingTime",
        "location",
        "status",
      ];

      const updatedData = {
        name: "",
        phoneNumber: "",
        address: "",
        location: "",
        serviceIds: [] as string[],
        price: [] as string[],
        openingTime: "",
        closingTime: "",
        description: [] as string[],
        isActive: false,
      };

      fields.forEach((field) => {
        const inputElement = document.querySelector(
          `.input-${field}`
        ) as HTMLInputElement;
        if (inputElement) {
          switch (field) {
            case "name":
              updatedData.name = inputElement.value;
              break;
            case "phone":
              updatedData.phoneNumber = inputElement.value;
              break;
            case "address":
              updatedData.address = inputElement.value;
              break;
            case "openingTime":
              updatedData.openingTime = inputElement.value;
              break;
            case "location":
              updatedData.location = inputElement.value;
              break;
            case "closingTime":
              updatedData.closingTime = inputElement.value;
              break;
            case "status":
              updatedData.isActive = inputElement.value === "active";
              break;
          }
        }
      });

      const serviceItems = document.querySelectorAll(".service-item");
      serviceItems.forEach((serviceItem) => {
        const serviceId = serviceItem.getAttribute("data-id");
        const priceInput = serviceItem.querySelector(
          ".input-service-price"
        ) as HTMLInputElement;
        const descriptionInput = serviceItem.querySelector(
          ".input-service-description"
        ) as HTMLInputElement;

        if (serviceId && priceInput && descriptionInput) {
          updatedData.serviceIds.push(serviceId);
          updatedData.price.push(priceInput.value);
          updatedData.description.push(descriptionInput.value);
        }
      });

      try {
        const updatedProfile = await supplierApi.put(updatedData);
      } catch (err) {
        console.log("err", err);
      }
    }

    async function fetchData() {
      try {
        const id = Number(localStorage.getItem("companyId"));

        const response = await supplierApi.getOne(id);

        localStorage.setItem("categoryId", response.companies.category.id);

        await renderContent(response);
      } catch (err) {
        console.log("err", err);
      }
    }

    async function renderContent(data: any) {
      const image = document.getElementById(
        "company-image"
      ) as HTMLImageElement;

      image.src = data.companies.photo;

      const companyName = document.querySelector(".name") as HTMLSpanElement;
      companyName.textContent = data.companies.name;

      const addressName = document.querySelector(".address") as HTMLSpanElement;
      addressName.textContent = data.companies.address;

      const phone = document.querySelector(".phone") as HTMLSpanElement;
      phone.textContent = data.companies.phoneNumber;

      const openingTime = document.querySelector(
        ".openingTime"
      ) as HTMLSpanElement;
      openingTime.textContent = data.companies.openingTime;

      const closingTime = document.querySelector(
        ".closingTime"
      ) as HTMLSpanElement;
      closingTime.textContent = data.companies.closingTime;

      const isActive = document.querySelector(".status") as HTMLSpanElement;
      isActive.textContent = data.companies.isActive ? "active" : "inactive";

      const location = document.querySelector(".location") as HTMLSpanElement;
      location.textContent = data.companies.location;

      displayServices(data.companies.ServiceToCompany);

      const categoryDescriptionElement = document.getElementsByClassName(
        "category-description"
      )[0];
      if (categoryDescriptionElement) {
        const categoryDescription = categoryDescriptionElement.innerHTML;
      }
    }

    fetchData();
    fetchServices();
  };
}
