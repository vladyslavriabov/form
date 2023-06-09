import * as Yup from "yup";

const phoneRegex = RegExp(/^\+?3?8?(0\d{9})$/);
const validationSchema = Yup.object({
  username: Yup.string()
    .matches(/^[A-Za-zА-Яа-я ]+$/, "Only alphabetic characters allowed")
    .max(30, "Name must be 30 characters or less")
    .required("Name is required"),
  birthday: Yup.string()
    .required("Date is required")
    .test("test-date", "Please enter correct date", function (dateString) {
      if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false;
      const currentYear = new Date().getFullYear();
      // Parse the date parts to integers
      var parts = dateString.split("/");
      var day = parseInt(parts[0], 10);
      var month = parseInt(parts[1], 10);
      var year = parseInt(parts[2], 10);
      // Check the ranges of month and year
      if (year < 1900 || year > currentYear || month === 0 || month > 12)
        return false;
      var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      // Adjust for leap years
      if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
        monthLength[1] = 29;
      // Check the range of the day
      return day > 0 && day <= monthLength[month - 1];
    }),
  gender: Yup.string().required("Gender is required"),
  city: Yup.string().required("City is required"),
  doctor: Yup.string().required("Doctor is required"),
  email: Yup.string().email("Please enter a valid email"),
  mobilephone: Yup.string()
    .matches(phoneRegex, "Phone number is not valid")
    .when("email", {
      is: (email) => !email,
      then: () =>
        Yup.string()
          .required("Please enter an email or phone number")
          .matches(phoneRegex, "Phone number is not valid"),
    }),
});
export default validationSchema;
