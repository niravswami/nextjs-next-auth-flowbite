export const IS_VALID_FN = {
  email: (email: string) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let isValid = true;

    if (!reg.test(email)) isValid = false;
    return isValid;
  },
  password: (password: any) => {
    //check empty password field
    if (password === "") {
      return "password is required!";
    }

    //minimum password length validation
    if (password.length < 8) {
      return "password length must be atleast 8 characters";
    }

    //maximum length of password validation
    if (password.length > 15) {
      return "password length must not exceed 15 characters";
    } else {
      return "";
    }
  },
};
