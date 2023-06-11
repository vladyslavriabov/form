import { useEffect, useState } from "react";
import "./App.css";
import { useFormik } from "formik";
import validationSchema from "./ValidationSchema";
import FormInput from "./components/FormInput/FormInput";
import FormList from "./components/FormList/FormList";
import FormRadioGroup from "./components/FormRadioGroup/FormRadioGroup";
import Loader from "./components/Loader/Loader";

function App() {
  const formik = useFormik({
    initialValues: {
      username: "",
      birthday: "",
      gender: "",
      city: "",
      specialty: "",
      doctor: "",
      email: "",
      mobilephone: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert("Success");
      console.log(values);
    },
  });
  const [loaded, setLoaded] = useState({
    cities: false,
    specialties: false,
    doctors: false,
    fetchError: false,
  });
  const [cities, setCities] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [age, setAge] = useState("");
  const [filterForDoctors, setFilterForDoctors] = useState({});

  const fetchData = async (url, setValue, loadingData) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Sorry something went wrong");
      }
      const data = await response.json();
      setValue(data);
      setLoaded((prevObject) => ({
        ...prevObject,
        [loadingData]: true,
      }));
      console.log(loaded);
    } catch (error) {
      console.log(error);
      setLoaded((prevObject) => ({
        ...prevObject,
        fetchError: true,
      }));
    }
  };

  const filterList = (filterTarget, filterParameter, list) => {
    return list.filter((item) =>
      filterParameter ? item[filterTarget] === filterParameter : true
    );
  };

  const handleAge = () => {
    if ((!formik.errors.birthday && formik.touched.birthday) || !specialties)
      return;
    const [day, mounth, year] = formik.values.birthday.split("/");
    const birthday = `${mounth}-${day}-${year}`;
    const years = Math.floor((new Date() - new Date(birthday)) / 31536000000);
    const checkAge = Number.isInteger(years) ? years : "";
    setAge(checkAge);
  };

  const handleDoctorChoice = () => {
    if (!formik.values.doctor || !doctors) return;
    const selectedDoctor = filterList("id", formik.values.doctor, doctors)[0];
    formik.values.city = selectedDoctor.cityId;
    formik.values.specialty = selectedDoctor.specialityId;
  };

  const handleGenderChage = () => {
    if (formik.values.gender) {
      const HasSelectedValue = filterList(
        "id",
        formik.values.specialty,
        filteredSpecialties
      );
      if (HasSelectedValue.length > 0) {
        if (HasSelectedValue[0].params) {
          if (HasSelectedValue[0].params.gender) {
            if (
              formik.values.gender ===
              HasSelectedValue[0].params.gender.toLowerCase()
            ) {
              !formik.values.gender && (formik.values.doctor = "");
            } else {
              if (formik.values.gender) {
                formik.values.doctor = "";
                formik.values.specialty = "";

                console.log(formik.values.specialty);
              }
            }
          }
        }
      }
    }
  };

  const handleSpecialtyChange = () => {
    if (formik.values.specialty && formik.values.doctor) {
      const { specialityId } = filterList(
        "id",
        formik.values.doctor,
        doctors
      )[0];
      specialityId !== formik.values.specialty && (formik.values.doctor = "");
    }
  };

  const handleGenderAgeChange = () => {
    let filterByGender = specialties;
    if (formik.values.gender) {
      filterByGender = specialties.filter((specialty) =>
        specialty.params && specialty.params.gender
          ? specialty.params.gender.toLowerCase() === formik.values.gender
          : true
      );
    }

    const specialitiesByAge = filterByGender.filter((specialty) => {
      if (!age) return true;
      return specialty.params &&
        (specialty.params.maxAge || specialty.params.minAge)
        ? age >= specialty.params.minAge || age <= specialty.params.maxAge
        : true;
    });
    setFilteredSpecialties(specialitiesByAge);
  };
  //fetch data from API
  useEffect(() => {
    fetchData(
      "https://run.mocky.io/v3/9fcb58ca-d3dd-424b-873b-dd3c76f000f4",
      setCities,
      "cities"
    );
    fetchData(
      "https://run.mocky.io/v3/e8897b19-46a0-4124-8454-0938225ee9ca",
      setSpecialties,
      "specialties"
    );
    fetchData(
      "https://run.mocky.io/v3/3d1c993c-cd8e-44c3-b1cb-585222859c21",
      setDoctors,
      "doctors"
    );
    console.log(loaded);
  }, []);

  useEffect(() => {
    setFilteredDoctors(doctors);
  }, [doctors]);

  useEffect(() => {
    setFilteredSpecialties(specialties);
  }, [specialties]);

  useEffect(() => {
    handleDoctorChoice();
  }, [formik.values.doctor]);
  useEffect(() => {
    handleAge();
  }, [formik.values.birthday]);

  useEffect(() => {
    let isPediatrician = age <= 16;
    if (age) {
      setFilterForDoctors({ ...filterForDoctors, isPediatrician });
    } else {
      const { isPediatrician, ...others } = filterForDoctors;
      setFilterForDoctors({ ...others });
    }
    handleGenderAgeChange();
    handleGenderChage();
    if (filterForDoctors.isPediatrician && formik.values.doctor) {
      const { isPediatrician } = filterList(
        "id",
        formik.values.doctor,
        doctors
      )[0];
      isPediatrician !== filterForDoctors.isPediatrician &&
        (formik.values.doctor = "");
    }
  }, [age, formik.values.gender]);

  useEffect(() => {
    const { specialityId, ...others } = filterForDoctors;
    formik.values.specialty
      ? setFilterForDoctors({
          ...filterForDoctors,
          specialityId: formik.values.specialty,
        })
      : setFilterForDoctors({ ...others });
    handleSpecialtyChange();
  }, [formik.values.specialty]);

  useEffect(() => {
    const { cityId, ...others } = filterForDoctors;
    formik.values.city
      ? setFilterForDoctors({
          ...filterForDoctors,
          cityId: formik.values.city,
        })
      : setFilterForDoctors({ ...others });
  }, [formik.values.city]);

  useEffect(() => {
    let res = doctors.filter(function (item) {
      if (Object.keys(filterForDoctors).length < 1) return true;
      for (var key in filterForDoctors) {
        if (item[key] === undefined || item[key] !== filterForDoctors[key])
          return false;
      }
      return true;
    });
    setFilteredDoctors(res);
  }, [
    filterForDoctors.specialityId,
    filterForDoctors.cityId,
    filterForDoctors.isPediatrician,
  ]);
  const formStructure = [
    {
      component: "FormInput",
      id: 1,
      type: "text",
      label: "Name",
      name: "username",
      autoComplete: "name",
    },
    {
      component: "FormInput",
      id: 2,
      name: "birthday",
      label: "Birthday",
      mask: "dD/mM/YYYY",
      maskChar: "",
      formatChars: {
        Y: "[0-9]",
        m: "[0-1]",
        M: "[0-9]",
        d: "[0-3]",
        D: "[0-9]",
      },
      placeholder: "DD/MM/YYYY",
    },
    {
      component: "FormRadioGroup",
      id: 3,
      name: "gender",
      label: "Sex",
      values: [
        {
          value: "male",
          label: "Male",
        },
        {
          value: "female",
          label: "Female",
        },
      ],
    },
    {
      component: "FormList",
      id: 4,
      label: "City",
      name: "city",
      data: cities,
    },
    {
      component: "FormList",
      id: 5,
      label: "Doctor specialty",
      name: "specialty",
      data: filteredSpecialties,
    },
    {
      component: "FormList",
      id: 6,
      label: "Doctor",
      name: "doctor",
      data: filteredDoctors,
    },
    {
      component: "FormInput",
      id: 7,
      type: "text",
      label: "Email",
      name: "email",
      autoComplete: "email",
    },
    {
      component: "FormInput",
      id: 8,
      type: "text",
      label: "Mobile Number",
      name: "mobilephone",
      mask: "999999999999",
      maskChar: "",
      autoComplete: "tel",
    },
  ];
  return (
    <>
      <div className="form-wrapper">
        {loaded.cities && loaded.specialties && loaded.doctors ? (
          <form onSubmit={formik.handleSubmit}>
            {formStructure.map((item) => {
              switch (item.component) {
                case "FormInput":
                  return (
                    <FormInput
                      key={item.id}
                      {...item}
                      onChange={formik.handleChange}
                      value={formik.values[item.name]}
                      onBlur={formik.handleBlur}
                      error={formik.errors[item.name]}
                      touched={formik.touched[item.name]}
                    />
                  );
                case "FormList":
                  return (
                    <FormList
                      key={item.id}
                      {...item}
                      onChange={formik.handleChange}
                      value={formik.values[item.name]}
                      onBlur={formik.handleBlur}
                      error={formik.errors[item.name]}
                      touched={formik.touched[item.name]}
                    />
                  );
                case "FormRadioGroup":
                  return (
                    <FormRadioGroup
                      key={item.id}
                      {...item}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values[item.name]}
                      error={formik.errors[item.name]}
                      touched={formik.touched[item.name]}
                    />
                  );
                default:
                  return null;
              }
            })}
            <button className="btn" type="submit">
              Submit
            </button>
          </form>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}

export default App;
