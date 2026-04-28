// utils/loader.ts
import Swal from "sweetalert2";

export const showLoading = (message = "Loading...") => {
  Swal.fire({
    title: message,
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });
};

export const hideLoading = () => {
  Swal.close();
};