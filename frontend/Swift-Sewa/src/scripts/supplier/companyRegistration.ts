import Cookies from "js-cookie";
import { categoryApi } from "./../../api/categories";
import { supplierApi } from "../../api/supplier";
import { displayResponseErrors } from "../../utils/errorHandler";
import axios from "axios";
import { showToast } from "../../constants/toastify";
import { Service } from "../../interface/service";
import { Category } from "../../interface/category";
import { SupplierRegistrationFormData } from "../../interface/form";

export class CompanyRegistrationAction {
  static registration: () => void = async () => {
    const submitButton = document.getElementById("submit") as HTMLButtonElement;
    let categoriesArray: Category[] = [];

    // Fetch categories and their related services
    async function fetchCategoriesServices() {
      try {
        categoriesArray = [];
        const data = await categoryApi.get();

        const categorySelect = document.getElementById(
          "categoryId"
        ) as HTMLSelectElement;

        categorySelect.innerHTML = '<option value="">Select Category</option>';

        data.message.forEach((item: Category) => {
          const option = document.createElement("option") as HTMLOptionElement;
          option.value = item.id;
          option.textContent = item.name;
          categorySelect.appendChild(option);
          categoriesArray.push(item);
        });
      } catch (error) {
        throw error;
      }
    }

    function convertTime(time: string): string {
      let [hours, minutes] = time.split(":");
      let period = "AM";

      let hourTime: number = parseInt(hours);

      if (hourTime >= 12) {
        period = "PM";
        if (hourTime > 12) {
          hourTime -= 12;
        }
      } else if (hourTime === 0) {
        hourTime = 12;
      }

      return `${hourTime}:${minutes} ${period}`;
    }

    function logSelectedCategory() {
      const categorySelect = document.getElementById(
        "categoryId"
      ) as HTMLSelectElement;
      const selectedOption =
        categorySelect.options[categorySelect.selectedIndex];

      const selectedCategory = categoriesArray.find(
        (category) => category.name === `${selectedOption.textContent}`
      );
      console.log("selectedCategory", selectedCategory);

      const serviceOptionsContainer = document.getElementById(
        "serviceOptions"
      ) as HTMLDivElement;
      serviceOptionsContainer.innerHTML = "";

      if (selectedCategory) {
        selectedCategory.services.forEach((service) => {
          const label = document.createElement("label") as HTMLLabelElement;
          label.classList.add("inline-flex", "items-center", "block", "mt-2");

          const input = document.createElement("input") as HTMLInputElement;
          input.type = "checkbox";
          input.name = "serviceId[]";
          input.value = service.id;
          input.classList.add("form-checkbox");

          const span = document.createElement("span");
          span.classList.add("ml-2");
          span.textContent = service.name;

          const priceInput = document.createElement(
            "input"
          ) as HTMLInputElement;
          priceInput.placeholder = "Rs:";
          priceInput.type = "number";
          priceInput.name = `price-${service.id}`;
          priceInput.value = service.price?.toString() || "";
          priceInput.disabled = true;
          priceInput.classList.add(
            "ml-2",
            "form-input",
            "border-gray-300",
            "rounded-md",
            "shadow-sm"
          );
          priceInput.style.width = "70px";

          input.addEventListener("change", function () {
            if (input.checked) {
              priceInput.disabled = false;
              priceInput.required = true;
            } else {
              priceInput.disabled = true;
              priceInput.required = false;
            }
          });

          label.appendChild(input);
          label.appendChild(span);
          label.appendChild(priceInput);
          serviceOptionsContainer.appendChild(label);
        });
      }
    }

    document
      .getElementById("categoryId")
      ?.addEventListener("change", logSelectedCategory);

    await fetchCategoriesServices();

    submitButton.onclick = async (e) => {
      e.preventDefault();

      const photoInput = document.getElementById("photo") as HTMLInputElement;
      const panPhotoInput = document.getElementById(
        "panPhoto"
      ) as HTMLInputElement;

      if (!photoInput.files || !panPhotoInput.files) {
        showToast("Please upload required photos", 3000, "red");
        return;
      }

      const formData: SupplierRegistrationFormData = {
        serviceIds: [],
        servicePrices: [],
        photo: photoInput.files[0],
        panPhoto: panPhotoInput.files[0],
        name: (document.getElementById("name") as HTMLInputElement).value,
        phoneNumber: (
          document.getElementById("phoneNumber") as HTMLInputElement
        ).value,
        address: (document.getElementById("address") as HTMLInputElement).value,
        location: (document.getElementById("location") as HTMLSelectElement)
          .value,
        description: (
          document.getElementById("company-description") as HTMLInputElement
        ).value,
        openingTime: convertTime(
          (document.getElementById("openingTime") as HTMLInputElement).value
        ),
        closingTime: convertTime(
          (document.getElementById("closingTime") as HTMLInputElement).value
        ),
        categoryId: (document.getElementById("categoryId") as HTMLSelectElement)
          .value,
        companyDescription: (
          document.getElementById("company-description") as HTMLInputElement
        ).value,
        userId: Cookies.get("userId") || "",
      };

      const serviceCheckboxes = document.querySelectorAll(
        'input[name="serviceId[]"]:checked'
      );
      serviceCheckboxes.forEach((checkbox) => {
        const priceInput = document.querySelector(
          `input[name="price-${(checkbox as HTMLInputElement).value}"]`
        ) as HTMLInputElement;
        formData.serviceIds.push((checkbox as HTMLInputElement).value);
        formData.servicePrices.push(`${priceInput.value}`);
      });

      const registrationData = new FormData();
      registrationData.append("photo", formData.photo);
      registrationData.append("pan-photo", formData.panPhoto);
      registrationData.append("name", formData.name);
      registrationData.append("phoneNumber", formData.phoneNumber);
      registrationData.append("address", formData.address);
      registrationData.append("location", formData.location);
      registrationData.append("openingTime", formData.openingTime);
      registrationData.append("closingTime", formData.closingTime);
      registrationData.append("availableDays", formData.availableDays || "");
      registrationData.append(
        "companyDescription",
        formData.companyDescription
      );
      registrationData.append("categoryId", formData.categoryId);
      registrationData.append(
        "serviceIds",
        JSON.stringify(formData.serviceIds)
      );
      registrationData.append("price", JSON.stringify(formData.servicePrices));
      registrationData.append("userId", formData.userId);

      showToast("Please wait while we process your request", 3000, "blue");

      try {
        const data = await supplierApi.post(registrationData);
        showToast(
          "Successful Please wait until admin verifies it",
          3000,
          "green"
        );
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorMessage = err.response?.data?.message || err.message;
          displayResponseErrors(errorMessage);
        } else if (err instanceof Error) {
          showToast(err.message, 3000, "red");
          displayResponseErrors(err.message);
        } else {
          displayResponseErrors("An unknown error occurred.");
        }
      }
    };
  };
}
