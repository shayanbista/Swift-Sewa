import axios from "axios";
import { displayResponseErrors } from "../utils/errorHandler";
import { userApi } from "../api/user";
import { roleAuthApi } from "../api/me";
import { showToast } from "../constants/toastify";
import { authApi } from "../api/auth";

export class LoginActions {
  static login: () => void = () => {
    let isFormValid: boolean = false;
    let errorMessage: string = "";

    const emailInput = document.getElementById(
      "emailInput"
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      "passwordInput"
    ) as HTMLInputElement;

    const emailErrorMessageElement = document.getElementById(
      "email-error"
    ) as HTMLParagraphElement;
    const passwordErrorMessageElement = document.getElementById(
      "password-error"
    ) as HTMLParagraphElement;

    const removeErrorMessages: () => void = () => {
      emailErrorMessageElement.innerHTML = "";
      passwordErrorMessageElement.innerHTML = "";
    };

    emailInput.oninput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const value = target.value;
      if (value.length <= 0) {
        emailInput.classList.add("error-border");
        emailErrorMessageElement.innerHTML = "Email is empty.";
        isFormValid = false;
      } else {
        emailInput.classList.remove("error-border");
        emailErrorMessageElement.innerHTML = "";
      }
    };

    passwordInput.oninput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const value = target.value;

      if (value.length === 0) {
        passwordInput.classList.add("error-border");
        passwordErrorMessageElement.innerHTML = "Password is empty";
        isFormValid = false;
      } else if (value.length < 8) {
        passwordErrorMessageElement.innerHTML =
          "Password must be at least 8 characters.";
        passwordInput.classList.add("error-border");
      } else {
        passwordInput.classList.remove("error-border");
        passwordErrorMessageElement.innerHTML = "";
      }
    };

    const login: () => void = async () => {
      try {
        const email = emailInput.value;
        const password = passwordInput.value;
        const loginData = { email, password };
        const checkLogin = await authApi.login(loginData);

        const {
          message: { accessToken, refreshToken },
        } = checkLogin;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        const userRole = await roleAuthApi.getMe();
        const role = userRole.role[0];

        switch (role) {
          case "user":
            window.location.href = "#/user/dashboard/";
            break;
          case "admin":
            showToast("logged-in successfully", 3000, "red");
            window.location.href = "#/admin/dashboard/";
            break;
          case "supplier":
            window.location.href = "#/supplier/dashboard/";
            break;
          default:
            window.location.href = "/#/login/";
            break;
        }
      } catch (err) {
        {
          if (axios.isAxiosError(err)) {
            const errorMessage = err.response?.data?.message || err.message;
            displayResponseErrors(errorMessage);
          } else if (err instanceof Error) {
            displayResponseErrors(err.message);
          } else {
            displayResponseErrors("An unknown error occurred.");
          }
          emailInput.value = "";
          passwordInput.value = "";
        }
      }
    };

    const validateForm: () => boolean = () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      emailInput.classList.remove("border-red-500");
      passwordInput.classList.remove("border-red-500");

      if (email.length <= 0 && password.length === 0) {
        emailInput.classList.add("error-border");
        passwordInput.classList.add("error-border");
        emailErrorMessageElement.innerHTML = "Email is empty.";
        passwordErrorMessageElement.innerHTML = "Password is empty.";
        isFormValid = false;
        errorMessage = "Please fill in the fields to continue.";
      } else if (email.length <= 0) {
        emailInput.classList.add("error-border");
        emailErrorMessageElement.innerHTML = "Email is empty.";
        isFormValid = false;
        errorMessage = "Please fill in the email address.";
      } else if (password.length <= 0) {
        passwordInput.classList.add("error-border");
        passwordErrorMessageElement.innerHTML = "Password is empty.";
        isFormValid = false;
        errorMessage = "Please fill in the password.";
      } else if (password.length < 8) {
        passwordInput.classList.add("error-border");
        passwordErrorMessageElement.innerHTML =
          "Password must be at least 8 characters.";
        isFormValid = false;
        errorMessage = "Password must be at least 8 characters long.";
      } else {
        isFormValid = true;
        removeErrorMessages();
      }

      if (!isFormValid) {
        const app = document.getElementById("app") as HTMLDivElement;

        const messageElement = document.createElement("div");
        messageElement.classList.add("toast");
        messageElement.innerHTML = errorMessage;

        app.appendChild(messageElement);

        setTimeout(() => {
          if (messageElement.parentElement) {
            messageElement.parentElement.removeChild(messageElement);
          }
        }, 3000);
      }

      if (isFormValid) {
        login();
      }
      return true;
    };

    const loginButton = document.getElementById(
      "loginBtn"
    ) as HTMLButtonElement;

    loginButton.onclick = (e: MouseEvent) => {
      e.preventDefault();
      validateForm();
    };
  };
}
