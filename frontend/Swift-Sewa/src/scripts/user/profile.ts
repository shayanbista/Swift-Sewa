import { userApi } from "../../api/user";


import axios from "axios";
import { displayResponseErrors } from "../../utils/errorHandler";
import { userProfile } from "../../interface/userProfile";
import { roleAuthApi } from "../../api/me";


export class UserProfileActions {
  static userProfile: () => void = async () => {
    let originalData: userProfile;
    fetchUser();

    const updateButton = document.getElementById(
      "update-button"
    ) as HTMLButtonElement;
    const saveButton = document.getElementById(
      "save-button"
    ) as HTMLButtonElement;

    updateButton.onclick = () => {
      enableEditing();
    };

    saveButton.onclick = () => {
      saveProfile();
    };

    async function fetchUser() {
      try {
        const currentRole = await roleAuthApi.getMe();
        const role = currentRole.role[0];
        const data = await userApi.get();
        const { email } = data.data;
        const { name, address, phoneNumber } = data.data.profile;
        originalData = {
          name,
          email,
          address,
          phoneNumber,
          role,
        };

        const nameInputs = document.querySelectorAll(
          ".name"
        ) as NodeListOf<HTMLInputElement>;
        console.log("nameInputs", nameInputs);
        const emailInput = document.getElementById("email") as HTMLInputElement;
        const addressInput = document.getElementById(
          "address"
        ) as HTMLInputElement;
        const phoneNumberInput = document.getElementById(
          "phone-number"
        ) as HTMLInputElement;
        const roleInput = document.getElementById("role") as HTMLInputElement;

        nameInputs.values = name;
        nameInputs.forEach((input) => {
          input.innerText = name;
        });
        emailInput.innerText = email;
        addressInput.innerText = address;
        phoneNumberInput.innerText = phoneNumber;
        roleInput.innerText = role;
      } catch (err) {
        console.log("err", err);
      }
    }

    function enableEditing() {
      const fields = document.querySelectorAll(
        ".editable"
      ) as NodeListOf<HTMLElement>;
      fields.forEach((field) => {
        const value = field.innerText;
        field.style.marginTop = "-6px";
        field.innerHTML = `<input class="w-full p-2 border rounded" value="${value}" />`;
      });
      (
        document.getElementById("update-button") as HTMLButtonElement
      ).style.display = "none";
      (
        document.getElementById("save-button") as HTMLButtonElement
      ).style.display = "inline-block";
    }

    async function saveProfile() {
      const fields = document.querySelectorAll(
        ".editable"
      ) as NodeListOf<HTMLElement>;
      let hasChanges = false;
      fields.forEach(async (field) => {
        const input = field.querySelector("input") as HTMLInputElement;
        if (input) {
          field.innerText = input.value;

          if (
            field.classList.contains("name") &&
            input.value !== originalData.name
          ) {
            originalData.name = input.value;
            hasChanges = true;
          } else if (
            field.id === "email" &&
            input.value !== originalData.email
          ) {
            originalData.email = input.value;
            hasChanges = true;
          } else if (
            field.id === "address" &&
            input.value !== originalData.address
          ) {
            originalData.address = input.value;
            hasChanges = true;
          } else if (
            field.id === "phone-number" &&
            input.value !== originalData.phoneNumber
          ) {
            originalData.phoneNumber = input.value;
            hasChanges = true;
          }
        }
      });

      delete originalData.role;
      try {
        const updateUser = await userApi.update(originalData);
        console.log("updatedUser", updateUser);
        fetchUser();
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorMessage = err.response?.data?.message || err.message;
          displayResponseErrors(errorMessage);
          console.log("err", err);
        }
      }

      (
        document.getElementById("update-button") as HTMLButtonElement
      ).style.display = "inline-block";
      (
        document.getElementById("save-button") as HTMLButtonElement
      ).style.display = "none";
    }
  };
}
